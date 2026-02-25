import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { User, Mail, Phone, Briefcase, Award, Star, Calendar, MapPin, Building2, GraduationCap, FileText, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import apiClient, { apiEndpoints } from '../../services/apiClient';
import { useAuth } from '../../hooks/useAuth';

const ProfileExpert = () => {
  const { user } = useAuth();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Fetch expert profile
  const fetchExpertProfile = async () => {
    try {
      setLoading(true);

      // Get the logged-in user's expert profile directly
      const response = await apiClient.get(apiEndpoints.experts.profile);

      if (response.data.success) {
        setExpert(response.data.data);
        setFormData(response.data.data);
      } else {
        toast.error(response.data.message || 'Failed to fetch expert profile');
      }
    } catch (error) {
      console.error('Error fetching expert profile:', error);
      toast.error(error.response?.data?.message || 'Error fetching expert profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchExpertProfile();
    }
  }, [user]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle nested object changes (like addresses)
  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await apiClient.put(apiEndpoints.experts.update(expert._id), formData);

      if (response.data.success) {
        setExpert(response.data.data);
        setEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Error updating profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#398C89]"></div>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Expert Profile Not Found</h2>
          <p className="text-gray-600">Please contact administrator to create your profile.</p>
        </div>
      </div>
    );
  }

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Expert Profile</h1>
        <p className="text-gray-600">Manage your professional information and details</p>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{expert.fullName}</h2>
              <p className="text-gray-600">{expert.expertId || 'ID Pending'}</p>
            
            </div>
          </div>
         
        </div>
      </div>

      {editing ? (
        // Edit Mode
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender || 'Male'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Professional Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certification</label>
                <input
                  type="text"
                  name="certification"
                  value={formData.certification || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Registration Year</label>
                <input
                  type="text"
                  name="medicalRegYear"
                  value={formData.medicalRegYear || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Law Specialization</label>
                <input
                  type="text"
                  name="lawSpecialization"
                  value={formData.lawSpecialization || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Expertise</label>
                <input
                  type="text"
                  name="expertise"
                  value={Array.isArray(formData.expertise) ? formData.expertise.join(', ') : formData.expertise || ''}
                  onChange={(e) => handleInputChange({...e, target: {name: 'expertise', value: e.target.value.split(', ').filter(s => s.trim())}})}
                  placeholder="Enter expertise areas separated by commas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>
            </div>
          </div>

          {/* Organization Information Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Organization Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Office Address
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.officeAddress?.address || ''}
                  onChange={(e) => handleNestedChange('officeAddress', 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.officeAddress?.city || ''}
                  onChange={(e) => handleNestedChange('officeAddress', 'city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taluka</label>
                <input
                  type="text"
                  name="taluka"
                  value={formData.officeAddress?.taluka || ''}
                  onChange={(e) => handleNestedChange('officeAddress', 'taluka', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.officeAddress?.district || ''}
                  onChange={(e) => handleNestedChange('officeAddress', 'district', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.officeAddress?.state || ''}
                  onChange={(e) => handleNestedChange('officeAddress', 'state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                <input
                  type="text"
                  name="pinCode"
                  value={formData.officeAddress?.pinCode || ''}
                  onChange={(e) => handleNestedChange('officeAddress', 'pinCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.officeAddress?.country || ''}
                  onChange={(e) => handleNestedChange('officeAddress', 'country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>
            </div>
          </div>

          {/* Fee Structure Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Fee Structure
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
                <input
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        // View Mode
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{expert.email || '-'}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{expert.phoneNumber || '-'}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">WhatsApp</p>
                  <p className="font-medium">{expert.whatsappNumber || '-'}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{formatDate(expert.dob)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium">{expert.gender || '-'}</p>
                </div>
              </div>

              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="font-medium">{expert.expertId || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Professional Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Qualification</p>
                <p className="font-medium">{expert.qualification || '-'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Certification</p>
                <p className="font-medium">{expert.certification || '-'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-medium">{expert.experience || 0} years</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">License Number</p>
                <p className="font-medium">{expert.licenseNumber || '-'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Medical Reg Year</p>
                <p className="font-medium">{expert.medicalRegYear || '-'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Law Specialization</p>
                <p className="font-medium">{expert.lawSpecialization || '-'}</p>
              </div>

              <div className="md:col-span-2 lg:col-span-4">
                <p className="text-sm text-gray-500">Expertise</p>
                <p className="font-medium">
                  {Array.isArray(expert.expertise) ? expert.expertise.join(', ') : expert.expertise || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Organization Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Organization Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Organization Name</p>
                <p className="font-medium">{expert.organizationName || '-'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Designation</p>
                <p className="font-medium">{expert.designation || '-'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{expert.department || '-'}</p>
              </div>
            </div>
          </div>

          {/* Office Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Office Address
            </h3>

            <div>
              <p className="font-medium">{expert.officeAddress?.address || '-'}</p>
              <p>{expert.officeAddress?.city || '-'}, {expert.officeAddress?.district || '-'}</p>
              <p>{expert.officeAddress?.state || '-'}, {expert.officeAddress?.pinCode || '-'}</p>
              <p>{expert.officeAddress?.country || '-'}</p>
            </div>
          </div>

          {/* Specializations */}
          {expert.specializations && expert.specializations.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Specializations
              </h3>

              <div className="space-y-3">
                {expert.specializations.map((specialization, index) => (
                  <div key={index} className="border-l-4 border-[#398C89] pl-4 py-1">
                    <p className="font-medium">{specialization.field}</p>
                    <p className="text-sm text-gray-600">{specialization.subField}</p>
                    <p className="text-sm text-gray-500">Experience: {specialization.experience} years</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Metrics */}
       

          {/* Fee Structure */}
          {expert.consultationFee || expert.hourlyRate ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Fee Structure
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Consultation Fee</p>
                  <p className="font-medium">{formatCurrency(expert.consultationFee)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Hourly Rate</p>
                  <p className="font-medium">{formatCurrency(expert.hourlyRate)}</p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Status Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium px-2 py-1 inline-block rounded ${
                  expert.status === 'active' ? 'bg-green-100 text-green-800' :
                  expert.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                  expert.status === 'busy' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {expert.status || '-'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Availability</p>
                <p className={`font-medium px-2 py-1 inline-block rounded ${
                  expert.availability === 'available' ? 'bg-green-100 text-green-800' :
                  expert.availability === 'limited' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {expert.availability || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileExpert;