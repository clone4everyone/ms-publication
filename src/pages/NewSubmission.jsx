import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  createSubmission, 
  uploadDocument, 
  addMetadata, 
  confirmSubmission,
  clearCurrentSubmission 
} from '../redux/slices/submissionSlice';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaArrowRight, FaCheck, FaUpload, FaTimes, FaSpinner } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../utils/api';
const STEPS = [
  { number: 1, title: 'Start', description: 'Basic information' },
  { number: 2, title: 'Upload', description: 'Document upload' },
  { number: 3, title: 'Metadata', description: 'Article details' },
  { number: 4, title: 'Confirm', description: 'Review submission' },
  { number: 5, title: 'Complete', description: 'Submission complete' }
];

const SECTIONS = [
  'Original Article(s)',
  'Review Article(s)',
  'Editorial',
  'Short Communication(s)',
  'Case Study(s)',
  'Letter to Editor',
  'Innopharm 3',
  'Conference Proceeding',
  'ICMAT 2020 Full Proceeding Paper',
  'Conference Proceedings'
];

const JOURNALS = ['pharma'];

function NewSubmission() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentSubmission, isLoading } = useSelector((state) => state.submissions);

  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Step 1 data
  const [step1Data, setStep1Data] = useState({
    journal: '',
    section: '',
    commentsForEditor: '',
    potentialReviewers: [{ name: '', affiliation: '', email: '', expertise: '' }],
    agreementsAccepted: false
  });

  // Step 3 data
  const [step3Data, setStep3Data] = useState({
    prefix: '',
    title: '',
    subtitle: '',
    abstract: '',
    coAuthors: [],
    keywords: [],
    references: [],
    keywordInput: '',
    referenceInput: ''
  });

  const [keywordSuggestions, setKeywordSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Add this function after the state declarations
  const fetchKeywordSuggestions = async (query) => {
    if (!query || query.length < 2 || !step1Data.journal) return;
    
    setLoadingSuggestions(true);
    try {
      // Call your API or use a service to get keyword suggestions
      const response = await api.get(`/api/keywords/suggestions`, {
        params: {
          journal: step1Data.journal,
          query: query
        }
      });
      
      if (response.data.success) {
        setKeywordSuggestions(response.data.data.suggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching keyword suggestions:', error);
      // Fallback to generic suggestions if API fails
      setKeywordSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Debounce function for keyword input
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedFetchKeywords = debounce(fetchKeywordSuggestions, 300);

  useEffect(() => {
    return () => {
      dispatch(clearCurrentSubmission());
    };
  }, [dispatch]);

  const handleStep1Submit = async () => {
    if (!step1Data.journal || !step1Data.section) {
      toast.error('Please select journal and section');
      return;
    }
    if (!step1Data.agreementsAccepted) {
      toast.error('Please accept all submission requirements');
      return;
    }

    const result = await dispatch(createSubmission(step1Data));
    if (result.type === 'submissions/create/fulfilled') {
      setCurrentStep(2);
      toast.success('Step 1 completed');
    }
  };

  const handleStep2Submit = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a document');
      return;
    }

    const result = await dispatch(uploadDocument({
      id: currentSubmission._id,
      file: uploadedFile
    }));

    if (result.type === 'submissions/uploadDocument/fulfilled') {
      setCurrentStep(3);
      toast.success('Document uploaded successfully');
    }
  };

  const handleStep3Submit = async () => {
    if (!step3Data.title || !step3Data.abstract) {
      toast.error('Please fill in title and abstract');
      return;
    }

    const result = await dispatch(addMetadata({
      id: currentSubmission._id,
      metadata: {
        prefix: step3Data.prefix,
        title: step3Data.title,
        subtitle: step3Data.subtitle,
        abstract: step3Data.abstract,
        coAuthors: step3Data.coAuthors,
        keywords: step3Data.keywords,
        references: step3Data.references
      }
    }));

    if (result.type === 'submissions/addMetadata/fulfilled') {
      setCurrentStep(4);
      toast.success('Metadata added successfully');
    }
  };

  const handleFinalSubmit = async () => {
    const result = await dispatch(confirmSubmission(currentSubmission._id));
    if (result.type === 'submissions/confirm/fulfilled') {
      setCurrentStep(5);
      toast.success('Submission completed successfully!');
      setTimeout(() => {
        navigate('/author/dashboard');
      }, 3000);
    }
  };

  const addReference = () => {
    setStep3Data(prev => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = prev.referenceInput;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      
      if (!textContent.trim()) {
        toast.error('Please enter a reference');
        return prev;
      }
      
      const newReferences = [...prev.references, prev.referenceInput];
      toast.success('Reference added successfully');
      
      return {
        ...prev,
        references: newReferences,
        referenceInput: ''
      };
    });
  };

  const removeReference = (index) => {
    const newReferences = step3Data.references.filter((_, i) => i !== index);
    setStep3Data({ ...step3Data, references: newReferences });
  };

  const addReviewer = () => {
    setStep1Data({
      ...step1Data,
      potentialReviewers: [...step1Data.potentialReviewers, { name: '', affiliation: '', email: '', expertise: '' }]
    });
  };

  const removeReviewer = (index) => {
    const newReviewers = step1Data.potentialReviewers.filter((_, i) => i !== index);
    setStep1Data({ ...step1Data, potentialReviewers: newReviewers });
  };

  const addCoAuthor = () => {
    setStep3Data({
      ...step3Data,
      coAuthors: [...step3Data.coAuthors, {
        prefix: '',
        firstName: '',
        lastName: '',
        email: '',
        affiliation: '',
        isPrimaryContact: false,
        inBrowseList: true
      }]
    });
  };

  const removeCoAuthor = (index) => {
    const newCoAuthors = step3Data.coAuthors.filter((_, i) => i !== index);
    setStep3Data({ ...step3Data, coAuthors: newCoAuthors });
  };

  const addKeyword = () => {
    if (step3Data.keywordInput.trim()) {
      setStep3Data({
        ...step3Data,
        keywords: [...step3Data.keywords, step3Data.keywordInput.trim()],
        keywordInput: ''
      });
    }
  };

  const removeKeyword = (index) => {
    const newKeywords = step3Data.keywords.filter((_, i) => i !== index);
    setStep3Data({ ...step3Data, keywords: newKeywords });
  };

  // Loading Button Component
  const LoadingButton = ({ onClick, disabled, loading, children, variant = 'primary', icon: Icon }) => {
    const baseClasses = "flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]";
    const variantClasses = {
      primary: "bg-outlook-blue hover:bg-outlook-darkBlue text-white",
      success: "bg-green-600 hover:bg-green-700 text-white",
      secondary: "text-gray-600 hover:text-gray-900"
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`${baseClasses} ${variantClasses[variant]}`}
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>{children}</span>
            {Icon && <Icon />}
          </>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-outlook-gray">
      {/* Header */}
      <div className="bg-outlook-blue text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/author/dashboard')}
            className="flex items-center space-x-2 hover:bg-white/10 px-3 py-2 rounded transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-xl font-semibold">New Submission</h1>
          <div className="w-32"></div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto py-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all ${
                      currentStep > step.number
                        ? 'bg-green-500 text-white'
                        : currentStep === step.number
                        ? 'bg-outlook-blue text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.number ? <FaCheck /> : step.number}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium">{step.title}</div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-4 ${
                      currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Step 1: Start */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 1: Start Your Submission</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Journal *
                </label>
                <select
                  value={step1Data.journal}
                  onChange={(e) => setStep1Data({ ...step1Data, journal: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-outlook-blue focus:border-transparent"
                >
                  <option value="">Choose a journal...</option>
                  {JOURNALS.map(j => (
                    <option key={j} value={j} className="capitalize">{j}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Section *
                </label>
                <select
                  value={step1Data.section}
                  onChange={(e) => setStep1Data({ ...step1Data, section: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-outlook-blue focus:border-transparent"
                >
                  <option value="">Choose a section...</option>
                  {SECTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments for Editor
                </label>
                <textarea
                  value={step1Data.commentsForEditor}
                  onChange={(e) => setStep1Data({ ...step1Data, commentsForEditor: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-outlook-blue focus:border-transparent"
                  placeholder="Any special comments or notes for the editor..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Potential Reviewers (At least 2 required)
                </label>
                {step1Data.potentialReviewers.map((reviewer, index) => (
                  <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Reviewer {index + 1}</h4>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeReviewer(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Name"
                        value={reviewer.name}
                        onChange={(e) => {
                          const newReviewers = [...step1Data.potentialReviewers];
                          newReviewers[index].name = e.target.value;
                          setStep1Data({ ...step1Data, potentialReviewers: newReviewers });
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-outlook-blue"
                      />
                      <input
                        type="text"
                        placeholder="Affiliation"
                        value={reviewer.affiliation}
                        onChange={(e) => {
                          const newReviewers = [...step1Data.potentialReviewers];
                          newReviewers[index].affiliation = e.target.value;
                          setStep1Data({ ...step1Data, potentialReviewers: newReviewers });
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-outlook-blue"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={reviewer.email}
                        onChange={(e) => {
                          const newReviewers = [...step1Data.potentialReviewers];
                          newReviewers[index].email = e.target.value;
                          setStep1Data({ ...step1Data, potentialReviewers: newReviewers });
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-outlook-blue"
                      />
                      <input
                        type="text"
                        placeholder="Field of Expertise"
                        value={reviewer.expertise}
                        onChange={(e) => {
                          const newReviewers = [...step1Data.potentialReviewers];
                          newReviewers[index].expertise = e.target.value;
                          setStep1Data({ ...step1Data, potentialReviewers: newReviewers });
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-outlook-blue"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addReviewer}
                  className="text-outlook-blue hover:text-outlook-darkBlue font-medium"
                >
                  + Add Another Reviewer
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={step1Data.agreementsAccepted}
                    onChange={(e) => setStep1Data({ ...step1Data, agreementsAccepted: e.target.checked })}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I confirm that this submission has not been previously published, nor is it before another journal for consideration. The submission was prepared strictly as per Instructions to Authors, and I agree to have my data collected and stored according to the privacy statement.
                  </span>
                </label>
              </div>

              <div className="flex justify-end">
                <LoadingButton
                  onClick={handleStep1Submit}
                  loading={isLoading}
                  icon={FaArrowRight}
                >
                  Save and Continue
                </LoadingButton>
              </div>
            </div>
          )}

          {/* Step 2: Upload Document */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 2: Upload Your Document</h2>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <FaUpload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {uploadedFile ? uploadedFile.name : 'Drop your document here or click to browse'}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Accepted formats: PDF, DOC, DOCX (Max 10MB)
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setUploadedFile(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block bg-outlook-blue hover:bg-outlook-darkBlue text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Choose File
                </label>
              </div>

              {uploadedFile && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-600">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}

              <div className="flex justify-between">
                <LoadingButton
                  onClick={() => setCurrentStep(1)}
                  variant="secondary"
                  icon={FaArrowLeft}
                >
                  Back
                </LoadingButton>
                <LoadingButton
                  onClick={handleStep2Submit}
                  loading={isLoading}
                  disabled={!uploadedFile}
                  icon={FaArrowRight}
                >
                  Upload and Continue
                </LoadingButton>
              </div>
            </div>
          )}

          {/* Step 3: Metadata */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 3: Enter Metadata</h2>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prefix</label>
                  <input
                    type="text"
                    value={step3Data.prefix}
                    onChange={(e) => setStep3Data({ ...step3Data, prefix: e.target.value })}
                    placeholder="A, The"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-outlook-blue"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={step3Data.title}
                    onChange={(e) => setStep3Data({ ...step3Data, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-outlook-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={step3Data.subtitle}
                  onChange={(e) => setStep3Data({ ...step3Data, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-outlook-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Abstract *</label>
                <ReactQuill
                  theme="snow"
                  value={step3Data.abstract}
                  onChange={(content) => setStep3Data({ ...step3Data, abstract: content })}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'script': 'sub'}, { 'script': 'super' }],
                      ['link'],
                      ['clean']
                    ]
                  }}
                  className="bg-white"
                  style={{ height: '200px', marginBottom: '50px' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                <div className="relative">
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={step3Data.keywordInput}
                      onChange={(e) => {
                        setStep3Data({ ...step3Data, keywordInput: e.target.value });
                        debouncedFetchKeywords(e.target.value);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addKeyword();
                          setShowSuggestions(false);
                        }
                      }}
                      onFocus={() => {
                        if (step3Data.keywordInput.length >= 2) {
                          setShowSuggestions(true);
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => setShowSuggestions(false), 200);
                      }}
                      placeholder="Type keyword for suggestions..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-outlook-blue"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        addKeyword();
                        setShowSuggestions(false);
                      }}
                      className="bg-outlook-blue text-white px-4 py-2 rounded-lg hover:bg-outlook-darkBlue"
                    >
                      Add
                    </button>
                  </div>
                  
                  {showSuggestions && step3Data.keywordInput.length >= 2 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {loadingSuggestions ? (
                        <div className="px-4 py-3 text-sm text-gray-500">Loading suggestions...</div>
                      ) : keywordSuggestions.length > 0 ? (
                        keywordSuggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setStep3Data({
                                ...step3Data,
                                keywords: [...step3Data.keywords, suggestion],
                                keywordInput: ''
                              });
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          No suggestions found. Press Enter to add "{step3Data.keywordInput}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {step3Data.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                    >
                      <span>{keyword}</span>
                      <button onClick={() => removeKeyword(index)}>
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">Co-Authors</label>
                  <button
                    type="button"
                    onClick={addCoAuthor}
                    className="text-outlook-blue hover:text-outlook-darkBlue text-sm font-medium"
                  >
                    + Add Co-Author
                  </button>
                </div>
                {step3Data.coAuthors.map((author, index) => (
                  <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Co-Author {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeCoAuthor(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={author.firstName}
                        onChange={(e) => {
                          const newAuthors = [...step3Data.coAuthors];
                          newAuthors[index].firstName = e.target.value;
                          setStep3Data({ ...step3Data, coAuthors: newAuthors });
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={author.lastName}
                        onChange={(e) => {
                          const newAuthors = [...step3Data.coAuthors];
                          newAuthors[index].lastName = e.target.value;
                          setStep3Data({ ...step3Data, coAuthors: newAuthors });
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={author.email}
                        onChange={(e) => {
                          const newAuthors = [...step3Data.coAuthors];
                          newAuthors[index].email = e.target.value;
                          setStep3Data({ ...step3Data, coAuthors: newAuthors });
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Affiliation"
                        value={author.affiliation}
                        onChange={(e) => {
                          const newAuthors = [...step3Data.coAuthors];
                          newAuthors[index].affiliation = e.target.value;
                          setStep3Data({ ...step3Data, coAuthors: newAuthors });
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">References</label>
                <div className="mb-3">
                  <ReactQuill
                    theme="snow"
                    value={step3Data.referenceInput}
                    onChange={(content) => {
                      setStep3Data(prev => ({ ...prev, referenceInput: content }));
                    }}
                    modules={{
                      toolbar: [
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered'}],
                        ['link'],
                        ['clean']
                      ]
                    }}
                    placeholder="Enter a reference and click Add..."
                    className="bg-white"
                    style={{ height: '100px', marginBottom: '50px' }}
                  />
                </div>
                
                <button
                  type="button"
                  onClick={addReference}
                  className="mb-4 bg-outlook-blue text-white px-4 py-2 rounded-lg hover:bg-outlook-darkBlue text-sm"
                >
                  + Add Reference
                </button>
                
                <div className="mb-2 text-xs text-gray-500">
                  Total References: {step3Data.references.length}
                </div>
                
                {step3Data.references.length > 0 && (
                  <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {step3Data.references.map((reference, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1 mr-3">
                          <span className="text-xs font-semibold text-gray-500 mr-2">[{index + 1}]</span>
                          <div 
                            className="inline text-sm text-gray-700"
                            dangerouslySetInnerHTML={{ __html: reference }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeReference(index)}
                          className="text-red-600 hover:text-red-700 flex-shrink-0"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {step3Data.references.length === 0 && (
                  <div className="text-sm text-gray-500 italic mt-2">
                    No references added yet
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <LoadingButton
                  onClick={() => setCurrentStep(2)}
                  variant="secondary"
                  icon={FaArrowLeft}
                >
                  Back
                </LoadingButton>
                <LoadingButton
                  onClick={handleStep3Submit}
                  loading={isLoading}
                  icon={FaArrowRight}
                >
                  Save and Continue
                </LoadingButton>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && currentSubmission && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 4: Review Your Submission</h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">Submission Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Journal:</span>
                    <span className="ml-2 font-medium capitalize">{currentSubmission.journal}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Section:</span>
                    <span className="ml-2 font-medium">{currentSubmission.section}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3">{currentSubmission.metadata?.title}</h3>
                {currentSubmission.metadata?.subtitle && (
                  <p className="text-gray-600 mb-3">{currentSubmission.metadata.subtitle}</p>
                )}
                <p className="text-sm text-gray-700 mb-4">{currentSubmission.metadata?.abstract}</p>
                {currentSubmission.metadata?.keywords && currentSubmission.metadata.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentSubmission.metadata.keywords.map((keyword, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
                {currentSubmission.documentFile && (
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <p className="text-sm">
                      <span className="font-medium">Document:</span> {currentSubmission.documentFile.filename}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  ⚠️ Once you submit, you cannot edit this submission. Please review all details carefully.
                </p>
              </div>

              <div className="flex justify-between">
                <LoadingButton
                  onClick={() => setCurrentStep(3)}
                  variant="secondary"
                  icon={FaArrowLeft}
                >
                  Back
                </LoadingButton>
                <LoadingButton
                  onClick={handleFinalSubmit}
                  loading={isLoading}
                  variant="success"
                  icon={FaCheck}
                >
                  Submit Manuscript
                </LoadingButton>
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {currentStep === 5 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheck className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Submission Complete!</h2>
              <p className="text-gray-600 mb-6">
                Your manuscript has been successfully submitted for review.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                You will be notified via email about the status of your submission.
              </p>
              <button
                onClick={() => navigate('/author/dashboard')}
                className="bg-outlook-blue hover:bg-outlook-darkBlue text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewSubmission;