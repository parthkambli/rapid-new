import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { User, Mail, Phone, Briefcase, Award, Star, Calendar, MapPin, Building2, GraduationCap, FileText, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import apiClient, { apiEndpoints } from '../../services/apiClient';
import { useAuth } from '../../hooks/useAuth';

const ProfileAdvocate = () => {
  const { user } = useAuth();
  const [advocate, setAdvocate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Fetch advocate profile
  const fetchAdvocateProfile = async () => {
    try {
      setLoading(true);

      // Get the logged-in user's advocate profile directly
      const response = await apiClient.get(apiEndpoints.advocates.profile);

      if (response.data.success) {
        setAdvocate(response.data.data);
        setFormData(response.data.data);
      } else {
        toast.error(response.data.message || 'Failed to fetch advocate profile');
      }
    } catch (error) {
      console.error('Error fetching advocate profile:', error);
      toast.error(error.response?.data?.message || 'Error fetching advocate profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAdvocateProfile();
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
      const response = await apiClient.put(apiEndpoints.advocates.update(advocate._id), formData);

      if (response.data.success) {
        setAdvocate(response.data.data);
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

  if (!advocate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Advocate Profile Not Found</h2>
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
        <h1 className="text-3xl font-bold text-gray-900">Advocate Profile</h1>
        <p className="text-gray-600">Manage your professional information and details</p>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{advocate.fullName}</h2>
              <p className="text-gray-600">{advocate.barCouncilNumber}</p>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm text-gray-600">
                  {advocate.rating} ({advocate.totalCases} cases)
                </span>
              </div>
            </div>
          </div>
          {/* <div className="flex space-x-3">
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] transition-colors"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div> */}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Bar Council Number</label>
                <input
                  type="text"
                  name="barCouncilNumber"
                  value={formData.barCouncilNumber || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Date</label>
                <input
                  type="date"
                  name="enrollmentDate"
                  value={formData.enrollmentDate ? new Date(formData.enrollmentDate).toISOString().split('T')[0] : ''}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Practice Type</label>
                <select
                  name="practiceType"
                  value={formData.practiceType || 'individual'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                >
                  <option value="individual">Individual</option>
                  <option value="partnership">Partnership</option>
                  <option value="firm">Firm</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={Array.isArray(formData.specialization) ? formData.specialization.join(', ') : formData.specialization || ''}
                  onChange={(e) => handleInputChange({...e, target: {name: 'specialization', value: e.target.value.split(', ').filter(s => s.trim())}})}
                  placeholder="Enter specializations separated by commas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Address Information
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Office Address</h4>
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

                  <div>
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

              <div>
                <h4 className="font-medium text-gray-800 mb-3">Residential Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.residentialAddress?.address || ''}
                      onChange={(e) => handleNestedChange('residentialAddress', 'address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.residentialAddress?.city || ''}
                      onChange={(e) => handleNestedChange('residentialAddress', 'city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.residentialAddress?.district || ''}
                      onChange={(e) => handleNestedChange('residentialAddress', 'district', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.residentialAddress?.state || ''}
                      onChange={(e) => handleNestedChange('residentialAddress', 'state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      name="pinCode"
                      value={formData.residentialAddress?.pinCode || ''}
                      onChange={(e) => handleNestedChange('residentialAddress', 'pinCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.residentialAddress?.country || ''}
                      onChange={(e) => handleNestedChange('residentialAddress', 'country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                    />
                  </div>
                </div>
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
                  <p className="font-medium">{advocate.email || '-'}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{advocate.phoneNumber || '-'}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">WhatsApp</p>
                  <p className="font-medium">{advocate.whatsappNumber || '-'}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{formatDate(advocate.dob)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium">{advocate.gender || '-'}</p>
                </div>
              </div>

              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="font-medium">{advocate.advocateId || '-'}</p>
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
                <p className="text-sm text-gray-500">Bar Council Number</p>
                <p className="font-medium">{advocate.barCouncilNumber || '-'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Enrollment Date</p>
                <p className="font-medium">{formatDate(advocate.enrollmentDate)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-medium">{advocate.experience || 0} years</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Practice Type</p>
                <p className="font-medium capitalize">{advocate.practiceType || '-'}</p>
              </div>

              <div className="md:col-span-2 lg:col-span-4">
                <p className="text-sm text-gray-500">Specialization</p>
                <p className="font-medium">
                  {Array.isArray(advocate.specialization) ? advocate.specialization.join(', ') : advocate.specialization || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Firm Information */}
          {advocate.firmName && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Firm Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Firm Name</p>
                  <p className="font-medium">{advocate.firmName || '-'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Firm Address</p>
                  <p className="font-medium">
                    {advocate.firmAddress?.address ? 
                      `${advocate.firmAddress.address}, ${advocate.firmAddress.city}, ${advocate.firmAddress.state} - ${advocate.firmAddress.pinCode}` 
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Office Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Office Address
            </h3>

            <div>
              <p className="font-medium">{advocate.officeAddress?.address || '-'}</p>
              <p>{advocate.officeAddress?.city || '-'}, {advocate.officeAddress?.district || '-'}</p>
              <p>{advocate.officeAddress?.state || '-'}, {advocate.officeAddress?.pinCode || '-'}</p>
              <p>{advocate.officeAddress?.country || '-'}</p>
            </div>
          </div>

          {/* Residential Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Residential Address
            </h3>

            <div>
              <p className="font-medium">{advocate.residentialAddress?.address || '-'}</p>
              <p>{advocate.residentialAddress?.city || '-'}, {advocate.residentialAddress?.district || '-'}</p>
              <p>{advocate.residentialAddress?.state || '-'}, {advocate.residentialAddress?.pinCode || '-'}</p>
              <p>{advocate.residentialAddress?.country || '-'}</p>
            </div>
          </div>

          {/* Qualifications */}
          {advocate.qualifications && advocate.qualifications.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Qualifications
              </h3>

              <div className="space-y-3">
                {advocate.qualifications.map((qualification, index) => (
                  <div key={index} className="border-l-4 border-[#398C89] pl-4 py-1">
                    <p className="font-medium">{qualification.degree}</p>
                    <p className="text-sm text-gray-600">{qualification.university}</p>
                    <p className="text-sm text-gray-500">Year: {qualification.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Metrics */}
       

          {/* Fee Structure */}
          {advocate.feeStructure && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Fee Structure
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Consultation Fee</p>
                  <p className="font-medium">{formatCurrency(advocate.feeStructure.consultationFee)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Case Fee</p>
                  <p className="font-medium">{formatCurrency(advocate.feeStructure.caseFee)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Hourly Rate</p>
                  <p className="font-medium">{formatCurrency(advocate.feeStructure.hourlyRate)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Contingency Fee</p>
                  <p className="font-medium">
                    {advocate.feeStructure.contingencyFee?.percentage ? 
                      `${advocate.feeStructure.contingencyFee.percentage}%` : '-'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Status Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium px-2 py-1 inline-block rounded ${
                  advocate.status === 'active' ? 'bg-green-100 text-green-800' :
                  advocate.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                  advocate.status === 'suspended' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {advocate.status || '-'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Availability</p>
                <p className={`font-medium px-2 py-1 inline-block rounded ${
                  advocate.availability === 'available' ? 'bg-green-100 text-green-800' :
                  advocate.availability === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {advocate.availability || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAdvocate;