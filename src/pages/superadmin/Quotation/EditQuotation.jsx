

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { toast } from 'react-toastify';

const EditQuotation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [membershipTypeLocked, setMembershipTypeLocked] = useState(false);
  const [selectedYears, setSelectedYears] = useState([]);
  const [priceMatrix, setPriceMatrix] = useState([]);

  const [formData, setFormData] = useState({
    trno: '',
    quotationDate: new Date().toISOString().split('T')[0],
    doctorId: '',
    doctorName: '',
    membershipType: 'INDIVIDUAL MEMBERSHIP',
    specialization: '',
    area: 'All India',
    narration: '',
    monthly: false,
    indemnityCover: false,
  });

  // FETCH DOCTORS & PACKAGES
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const res = await apiClient.get('/doctors', { params: { limit: 1000 } });
        setDoctors(res.data.data || []);
      } catch (err) {
        toast.error('Failed to load doctors');
      } finally {
        setLoadingDoctors(false);
      }
    };

    const fetchPackages = async () => {
      try {
        const res = await apiClient.get('/service-packages/list');
        setPackages(res.data.data || []);
      } catch (err) {
        toast.error('Failed to load packages');
      }
    };

    fetchDoctors();
    fetchPackages();
  }, []);

  // FETCH QUOTATION BY ID
  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(apiEndpoints.quotations.get(id));
        const q = res.data.data;

        // Fill form data
        setFormData({
          trno: q.trno || '',
          quotationDate: q.quotationDate?.split('T')[0] || new Date().toISOString().split('T')[0],
          doctorId: q.requester?.entityId || '',
          doctorName: q.requester?.name || '',
          membershipType: q.requester?.type?.includes('hospital') 
            ? (q.requester.type === 'hospital_individual' ? 'HOSPITAL + INDIVIDUAL MEMBERSHIP' : 'HOSPITAL MEMBERSHIP')
            : 'INDIVIDUAL MEMBERSHIP',
          specialization: q.specialization || 'N/A',
          area: q.area || 'All India',
          narration: q.requestDetails?.additionalRequirements || '',
          monthly: q.requestDetails?.paymentFrequency === 'monthly',
          indemnityCover: !!q.requestDetails?.specialConditions,
        });
        setMembershipTypeLocked(true);

        // Set selected years
        const years = q.requestDetails?.policyTerms || [];
        setSelectedYears(years.map(y => y.toString()));

        // Load existing price matrix
        const existingItems = q.requestDetails?.items || [];
        const matrix = existingItems.map((item, idx) => ({
          id: `existing_${idx}_${Date.now()}`,
          indemnity: item.indemnity || 'Custom Limit',
          monthly: item.monthly || null,
          ...years.reduce((acc, y) => ({
            ...acc,
            [`y${y}`]: item[`year_${y}`] || null
          }), {})
        }));

        setPriceMatrix(matrix.length > 0 ? matrix : []);
      } catch (err) {
        toast.error('Failed to load quotation');
        console.error(err);
        navigate('/admin/quotation-list');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchQuotation();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'doctorName') {
      const selectedDoctor = doctors.find(d => `${d.fullName} (${d.doctorId})` === value);
      if (selectedDoctor) {
        let mType = 'INDIVIDUAL MEMBERSHIP';
        if (selectedDoctor.doctorType === 'hospital') mType = 'HOSPITAL MEMBERSHIP';
        else if (selectedDoctor.doctorType === 'hospital_individual') mType = 'HOSPITAL + INDIVIDUAL MEMBERSHIP';

        setFormData(prev => ({
          ...prev,
          doctorId: selectedDoctor._id,
          doctorName: value,
          membershipType: mType,
          specialization: selectedDoctor.specialization?.join(', ') || 'N/A',
        }));
        setMembershipTypeLocked(true);
      }
    } else if (name.startsWith('year_')) {
      const year = name.split('_')[1];
      setSelectedYears(prev =>
        prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year].sort((a, b) => a - b)
      );
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handlePreview = () => {
    if (!formData.doctorName || selectedYears.length === 0) {
      toast.error('Please select doctor and at least one year');
      return;
    }
    setIsPreview(true);
  };

  const handleUpdate = async () => {
    if (priceMatrix.length === 0 || priceMatrix.every(r => r.disabled)) {
      toast.error('Add at least one valid indemnity row');
      return;
    }

    setSaving(true);
    const payload = {
      trno: formData.trno || undefined,
      requester: {
        type: formData.membershipType.includes('HOSPITAL') ? 'hospital' : 'doctor',
        name: formData.doctorName.split(' (')[0],
        entityId: formData.doctorId,
      },
      requestDetails: {
        policyTerms: selectedYears.map(Number),
        paymentFrequency: formData.monthly ? 'monthly' : 'yearly',
        additionalRequirements: formData.narration,
        specialConditions: formData.indemnityCover ? 'Indemnity Cover Required' : '',
        items: priceMatrix.map(row => {
          const item = { indemnity: row.indemnity.trim() || 'Custom' };
          selectedYears.forEach(y => {
            if (row[`y${y}`] != null && row[`y${y}`] !== '') {
              item[`year_${y}`] = Number(row[`y${y}`]);
            }
          });
          if (formData.monthly && row.monthly != null && row.monthly !== '') {
            item.monthly = Number(row.monthly);
          }
          return item;
        }).filter(i => Object.keys(i).length > 1)
      }
    };

    try {
      await apiClient.put(apiEndpoints.quotations.update(id), payload);
      toast.success('Quotation updated successfully!');
      navigate('/admin/quotation-list');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update quotation');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-16 h-16 border-8 border-[#15BBB3] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto m-4 sm:mt-14 p-2 max-w-7xl">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">Edit Quotation</h1>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">

          {/* Same Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">TRNO (Optional)</label>
              <input type="text" name="trno" value={formData.trno} onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-[#15BBB3]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Doctor / Hospital</label>
              <select name="doctorName" value={formData.doctorName} onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-3" disabled={loadingDoctors}>
                <option>{loadingDoctors ? 'Loading...' : 'Select'}</option>
                {doctors.map(d => (
                  <option key={d._id} value={`${d.fullName} (${d.doctorId})`}>
                    {d.fullName} ({d.doctorId})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Area</label>
              <input type="text" name="area" value={formData.area} onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-3" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Quotation Date</label>
              <input type="date" name="quotationDate" value={formData.quotationDate} onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Membership Type {membershipTypeLocked && <span className="text-green-600 text-xs">(Auto)</span>}
              </label>
              <select name="membershipType" value={formData.membershipType} onChange={handleChange}
                disabled={membershipTypeLocked}
                className="mt-1 block w-full border border-gray-300 rounded-md p-3 bg-gray-50">
                <option value="INDIVIDUAL MEMBERSHIP">INDIVIDUAL MEMBERSHIP</option>
                <option value="HOSPITAL MEMBERSHIP">HOSPITAL MEMBERSHIP</option>
                <option value="HOSPITAL + INDIVIDUAL MEMBERSHIP">HOSPITAL + INDIVIDUAL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <input type="text" value={formData.specialization} disabled
                className="mt-1 block w-full border border-gray-300 rounded-md p-3 bg-gray-100" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Narration</label>
            <textarea name="narration" value={formData.narration} onChange={handleChange}
              rows="3" className="mt-1 block w-full border border-gray-300 rounded-md p-3"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Membership Years</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[1,2,3,4,5,6,7,8,9,10].map(y => (
                <label key={y} className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" name={`year_${y}`} checked={selectedYears.includes(y.toString())}
                    onChange={handleChange} className="w-5 h-5 accent-[#15BBB3] rounded" />
                  <span className="text-sm font-medium">{y} Year</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-8">
            <label className="flex items-center space-x-3">
              <input type="checkbox" name="monthly" checked={formData.monthly} onChange={handleChange}
                className="w-5 h-5 accent-[#15BBB3]" />
              <span className="font-medium">Monthly Payment</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" name="indemnityCover" checked={formData.indemnityCover} onChange={handleChange}
                className="w-5 h-5 accent-[#15BBB3]" />
              <span className="font-medium">Indemnity Cover Required</span>
            </label>
          </div>

          <button type="button" onClick={handlePreview}
            className="bg-[#15BBB3] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#13a89e] transition">
            Preview Changes
          </button>
        </form>

        {isPreview && (
          <div className="mt-12 border-t-2 border-gray-200 pt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Preview & Edit Pricing</h2>
            <PricePreviewTable
              membershipType={formData.membershipType}
              selectedYears={selectedYears}
              showMonthly={formData.monthly}
              packages={packages}
              specialization={formData.specialization}
              initialMatrix={priceMatrix}
              setPriceMatrix={setPriceMatrix}
              onEdit={() => setIsPreview(false)}
              onSave={handleUpdate}
              saving={saving}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// FULL PRICE PREVIEW TABLE (Same as Create + Edit Support)
const PricePreviewTable = ({ membershipType, selectedYears, showMonthly, packages, specialization, initialMatrix = [], setPriceMatrix, onEdit, onSave, saving }) => {
  const [rows, setRows] = useState(initialMatrix.length > 0 ? initialMatrix : []);

  const formatNumber = (num) => (num == null || num === '') ? '' : Number(num).toLocaleString('en-IN');
  const parseNumber = (str) => str === '' ? null : Number(str.replace(/,/g, ''));

  useEffect(() => {
    if (initialMatrix.length > 0 && rows.length === 0) {
      setRows(initialMatrix);
      setPriceMatrix(initialMatrix);
    }
  }, [initialMatrix, rows.length, setPriceMatrix]);

  const updateRow = (id, field, value) => {
    const updated = rows.map(r => r.id === id ? { ...r, [field]: parseNumber(value) || '' } : r);
    setRows(updated);
    setPriceMatrix(updated.filter(r => !r.disabled));
  };

  const deleteRow = (id) => {
    const updated = rows.filter(r => r.id !== id);
    setRows(updated);
    setPriceMatrix(updated.filter(r => !r.disabled));
  };

  const addCustomRow = () => {
    const newRow = {
      id: 'custom_' + Date.now(),
      indemnity: 'Custom Limit',
      monthly: null,
      ...selectedYears.reduce((acc, y) => ({ ...acc, [`y${y}`]: null }), {})
    };
    setRows([...rows, newRow]);
    setPriceMatrix(prev => [...prev, newRow]);
  };

  return (
    <>
      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold border-r">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-r">Specialization</th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-r">Indemnity Limit</th>
              {showMonthly && <th className="px-4 py-3 text-left text-sm font-semibold border-r">Monthly</th>}
              {selectedYears.map(y => (
                <th key={y} className="px-4 py-3 text-left text-sm font-semibold border-r">{y} Year</th>
              ))}
              <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                {i === 0 && (
                  <>
                    <td rowSpan={rows.length} className="px-4 py-3 text-sm font-medium border-r align-middle bg-white">
                      {membershipType}
                    </td>
                    <td rowSpan={rows.length} className="px-4 py-3 text-sm font-medium border-r align-middle bg-white">
                      {specialization || 'All'}
                    </td>
                  </>
                )}
                <td className="px-4 py-3 border-r">
                  <input
                    type="text"
                    value={row.indemnity || ''}
                    onChange={(e) => updateRow(row.id, 'indemnity', e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm focus:ring-[#15BBB3]"
                    placeholder="e.g. 10 Cr"
                  />
                </td>
                {showMonthly && (
                  <td className="px-4 py-3 border-r">
                    <input
                      type="text"
                      value={formatNumber(row.monthly)}
                      onChange={(e) => updateRow(row.id, 'monthly', e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm focus:ring-[#15BBB3]"
                    />
                  </td>
                )}
                {selectedYears.map(y => (
                  <td key={y} className="px-4 py-3 border-r">
                    <input
                      type="text"
                      value={formatNumber(row[`y${y}`])}
                      onChange={(e) => updateRow(row.id, `y${y}`, e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm focus:ring-[#15BBB3]"
                    />
                  </td>
                ))}
                <td className="px-4 py-3 text-center">
                  <button onClick={() => deleteRow(row.id)}
                    className="text-red-600 hover:text-red-800 font-bold text-xl">×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button onClick={addCustomRow}
          className="text-[#15BBB3] font-semibold flex items-center gap-2 hover:underline">
          <span className="text-2xl">+</span> Add Custom Row
        </button>

        <div className="flex gap-4">
          <button onClick={onEdit}
            className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700">
            Back to Edit
          </button>
          <button onClick={onSave} disabled={saving}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50">
            {saving ? 'Updating...' : 'Update Quotation'}
          </button>
        </div>
      </div>
    </>
  );
};

export default EditQuotation;
