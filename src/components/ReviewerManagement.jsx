import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaUserPlus, FaEdit, FaToggleOn, FaToggleOff, FaSearch } from 'react-icons/fa';

function ReviewerManagement() {
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingReviewer, setEditingReviewer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    affiliation: '',
    specialization: []
  });

  const specializations = ['pharma', 'history', 'chemistry', 'science', 'ayurvedic', 'technology'];

  useEffect(() => {
    fetchReviewers();
  }, []);

  const fetchReviewers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/editor/reviewers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setReviewers(data.data.reviewers);
      }
    } catch (error) {
      toast.error('Error fetching reviewers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReviewer = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/editor/reviewers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Reviewer created successfully. Credentials sent to their email.');
        setShowCreateModal(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          affiliation: '',
          specialization: []
        });
        fetchReviewers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error creating reviewer');
    }
  };

  const handleUpdateReviewer = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/editor/reviewers/${editingReviewer._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          affiliation: formData.affiliation,
          specialization: formData.specialization,
          isActive: formData.isActive
        })
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Reviewer updated successfully');
        setEditingReviewer(null);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          affiliation: '',
          specialization: []
        });
        fetchReviewers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error updating reviewer');
    }
  };

  const handleToggleActive = async (reviewer) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/editor/reviewers/${reviewer._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !reviewer.isActive })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Reviewer ${reviewer.isActive ? 'deactivated' : 'activated'}`);
        fetchReviewers();
      }
    } catch (error) {
      toast.error('Error updating reviewer status');
    }
  };

  const handleSpecializationChange = (spec) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(spec)
        ? prev.specialization.filter(s => s !== spec)
        : [...prev.specialization, spec]
    }));
  };

  const filteredReviewers = reviewers.filter(r =>
    `${r.firstName} ${r.lastName} ${r.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Reviewer Management</h2>
          <p className="text-gray-600 mt-1">Manage reviewer accounts and assignments</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
        >
          <FaUserPlus className="w-5 h-5" />
          <span>Create Reviewer</span>
        </button>
      </div>

      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search reviewers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
        />
      </div>

      <div className="grid gap-4">
        {filteredReviewers.map((reviewer) => (
          <div key={reviewer._id} className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-teal-500 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {reviewer.firstName} {reviewer.lastName}
                  </h3>
                  {!reviewer.isActive && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-2">{reviewer.email}</p>
                {reviewer.affiliation && (
                  <p className="text-sm text-gray-500 mb-3">{reviewer.affiliation}</p>
                )}
                {reviewer.specialization && reviewer.specialization.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {reviewer.specialization.map((spec, idx) => (
                      <span key={idx} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold capitalize">
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  Active Reviews: <span className="font-bold text-gray-900">{reviewer.activeReviews || 0}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingReviewer(reviewer);
                    setFormData({
                      firstName: reviewer.firstName,
                      lastName: reviewer.lastName,
                      email: reviewer.email,
                      password: '',
                      affiliation: reviewer.affiliation || '',
                      specialization: reviewer.specialization || [],
                      isActive: reviewer.isActive
                    });
                  }}
                  className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                >
                  <FaEdit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleToggleActive(reviewer)}
                  className={`p-2 rounded-lg transition-colors ${
                    reviewer.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {reviewer.isActive ? <FaToggleOn className="w-6 h-6" /> : <FaToggleOff className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(showCreateModal || editingReviewer) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-2xl">
              <h3 className="text-2xl font-bold">
                {editingReviewer ? 'Edit Reviewer' : 'Create New Reviewer'}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  disabled={!!editingReviewer}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none disabled:bg-gray-100"
                />
              </div>

              {!editingReviewer && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Password *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">This password will be sent to the reviewer's email</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Affiliation</label>
                <input
                  type="text"
                  value={formData.affiliation}
                  onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Specialization</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {specializations.map((spec) => (
                    <label key={spec} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.specialization.includes(spec)}
                        onChange={() => handleSpecializationChange(spec)}
                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                      />
                      <span className="text-sm capitalize">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingReviewer(null);
                    setFormData({
                      firstName: '',
                      lastName: '',
                      email: '',
                      password: '',
                      affiliation: '',
                      specialization: []
                    });
                  }}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-100 font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={editingReviewer ? handleUpdateReviewer : handleCreateReviewer}
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
                >
                  {editingReviewer ? 'Update Reviewer' : 'Create Reviewer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewerManagement; 