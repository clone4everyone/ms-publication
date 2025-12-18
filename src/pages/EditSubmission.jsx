import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getSubmission,
  updateSubmissionMetadata,
  updateSubmissionDocument,
  canEditSubmission
} from '../redux/slices/submissionSlice';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave, FaUpload, FaTimes } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function EditSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentSubmission, canEdit, isLoading } = useSelector((state) => state.submissions);

  const [editMode, setEditMode] = useState('metadata'); // 'metadata' or 'document'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [metadata, setMetadata] = useState({
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

  useEffect(() => {
    dispatch(getSubmission(id));
    dispatch(canEditSubmission(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentSubmission?.metadata) {
      setMetadata({
        prefix: currentSubmission.metadata.prefix || '',
        title: currentSubmission.metadata.title || '',
        subtitle: currentSubmission.metadata.subtitle || '',
        abstract: currentSubmission.metadata.abstract || '',
        coAuthors: currentSubmission.metadata.coAuthors || [],
        keywords: currentSubmission.metadata.keywords || [],
        references: currentSubmission.metadata.references || [],
        keywordInput: '',
        referenceInput: ''
      });
    }
  }, [currentSubmission]);

  const handleUpdateMetadata = async () => {
    if (!metadata.title || !metadata.abstract) {
      toast.error('Please fill in title and abstract');
      return;
    }

    const result = await dispatch(updateSubmissionMetadata({
      id,
      metadata: {
        prefix: metadata.prefix,
        title: metadata.title,
        subtitle: metadata.subtitle,
        abstract: metadata.abstract,
        coAuthors: metadata.coAuthors,
        keywords: metadata.keywords,
        references: metadata.references
      }
    }));

    if (result.type === 'submissions/updateMetadata/fulfilled') {
      toast.success('Metadata updated successfully');
      navigate(`/submission/${id}`);
    }
  };

  const handleUpdateDocument = async () => {
    if (!uploadedFile) {
      toast.error('Please select a document');
      return;
    }

    const result = await dispatch(updateSubmissionDocument({ id, file: uploadedFile }));

    if (result.type === 'submissions/updateDocument/fulfilled') {
      toast.success('Document updated successfully');
      navigate(`/submission/${id}`);
    }
  };

  const addKeyword = () => {
    if (metadata.keywordInput.trim()) {
      setMetadata({
        ...metadata,
        keywords: [...metadata.keywords, metadata.keywordInput.trim()],
        keywordInput: ''
      });
    }
  };

  const removeKeyword = (index) => {
    const newKeywords = metadata.keywords.filter((_, i) => i !== index);
    setMetadata({ ...metadata, keywords: newKeywords });
  };

  const addReference = () => {
    setMetadata(prev => {
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
    const newReferences = metadata.references.filter((_, i) => i !== index);
    setMetadata({ ...metadata, references: newReferences });
  };

  const addCoAuthor = () => {
    setMetadata({
      ...metadata,
      coAuthors: [...metadata.coAuthors, {
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
    const newCoAuthors = metadata.coAuthors.filter((_, i) => i !== index);
    setMetadata({ ...metadata, coAuthors: newCoAuthors });
  };

  if (isLoading || !currentSubmission) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-outlook-blue"></div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-100 text-red-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Cannot Edit Submission</h2>
            <p className="mb-4">This submission cannot be edited at its current stage.</p>
            <button
              onClick={() => navigate(`/submission/${id}`)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Submission
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-outlook-gray">
      {/* Header */}
      <div className="bg-outlook-blue text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(`/submission/${id}`)}
            className="flex items-center space-x-2 hover:bg-white/10 px-3 py-2 rounded transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Submission</span>
          </button>
          <h1 className="text-xl font-semibold">Edit Submission</h1>
          <div className="w-32"></div>
        </div>
      </div>

      {/* Edit Mode Selector */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto py-4 px-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setEditMode('metadata')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                editMode === 'metadata'
                  ? 'bg-outlook-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Edit Metadata
            </button>
            <button
              onClick={() => setEditMode('document')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                editMode === 'document'
                  ? 'bg-outlook-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Update Document
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {editMode === 'metadata' ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Metadata</h2>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prefix</label>
                  <input
                    type="text"
                    value={metadata.prefix}
                    onChange={(e) => setMetadata({ ...metadata, prefix: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={metadata.title}
                    onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={metadata.subtitle}
                  onChange={(e) => setMetadata({ ...metadata, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Abstract *</label>
                <ReactQuill
                  theme="snow"
                  value={metadata.abstract}
                  onChange={(content) => setMetadata({ ...metadata, abstract: content })}
                  style={{ height: '200px', marginBottom: '50px' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={metadata.keywordInput}
                    onChange={(e) => setMetadata({ ...metadata, keywordInput: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    placeholder="Type keyword..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="bg-outlook-blue text-white px-4 py-2 rounded-lg hover:bg-outlook-darkBlue"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {metadata.keywords.map((keyword, index) => (
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
                <label className="block text-sm font-medium text-gray-700 mb-2">References</label>
                <ReactQuill
                  theme="snow"
                  value={metadata.referenceInput}
                  onChange={(content) => setMetadata(prev => ({ ...prev, referenceInput: content }))}
                  placeholder="Enter a reference..."
                  style={{ height: '100px', marginBottom: '50px' }}
                />
                <button
                  type="button"
                  onClick={addReference}
                  className="mb-4 bg-outlook-blue text-white px-4 py-2 rounded-lg hover:bg-outlook-darkBlue text-sm"
                >
                  + Add Reference
                </button>
                
                {metadata.references.length > 0 && (
                  <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {metadata.references.map((reference, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
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
                          className="text-red-600 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleUpdateMetadata}
                  disabled={isLoading}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  <FaSave />
                  <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Document</h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700">
                  <strong>Current Document:</strong> {currentSubmission.documentFile?.filename}
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <FaUpload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {uploadedFile ? uploadedFile.name : 'Upload new document'}
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

              <div className="flex justify-end">
                <button
                  onClick={handleUpdateDocument}
                  disabled={isLoading || !uploadedFile}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  <FaSave />
                  <span>{isLoading ? 'Uploading...' : 'Update Document'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditSubmission;