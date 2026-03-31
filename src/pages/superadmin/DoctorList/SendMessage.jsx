import React, { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient, { apiEndpoints } from '../../../services/apiClient';

const STATUS_COLORS = {
  Hot: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
  Cold: 'bg-teal-100 text-teal-700 ring-1 ring-teal-200',
  Close: 'bg-sky-100 text-sky-700 ring-1 ring-sky-200'
};

const DUE_WINDOW_OPTIONS = ['All', 'Due Soon', 'Overdue', 'Upcoming'];
const STATUS_OPTIONS = ['All', 'Hot', 'Cold', 'Close'];
const SORT_OPTIONS = [
  { value: 'due-asc', label: 'EMI Due — Soonest' },
  { value: 'due-desc', label: 'EMI Due — Oldest' },
  { value: 'amount-desc', label: 'Amount — High to Low' },
  { value: 'amount-asc', label: 'Amount — Low to High' }
];
const CHANNEL_OPTIONS = ['WhatsApp + Email', 'Email only', 'WhatsApp only'];

function currency(amount) {
  return `₹${(amount || 0).toLocaleString('en-IN')}`;
}

function matchesDueWindow(item, win) {
  if (win === 'All') return true;
  if (win === 'Overdue') return item.daysLeft < 0;
  if (win === 'Due Soon') return item.daysLeft >= 0 && item.daysLeft <= 7;
  if (win === 'Upcoming') return item.daysLeft > 7;
  return true;
}

export default function SendMessage() {
  const { doctorId } = useParams();
  const [filters, setFilters] = useState({
    status: 'All',
    search: '',
    window: 'All',
    sortBy: 'due-asc',
    date: '',
    channel: 'WhatsApp + Email'
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [subject, setSubject] = useState('EMI reminder — Rapid Medico');
  const [body, setBody] = useState(
    'Hi {{name}},\nYour monthly EMI of {{emi_amount}} is due on {{emi_due}} ({{emi_days_left}} days).\nPlease pay to avoid interruption.'
  );
  const [attachmentName, setAttachmentName] = useState('');
  const [selectedDoctorName, setSelectedDoctorName] = useState('');

  // Fetch doctors for messaging
  useEffect(() => {
    fetchDoctors();
  }, [doctorId]);

  // Pre-select doctor if ID is provided
  useEffect(() => {
    if (doctorId && rows.length > 0 && !loading) {
      const doctor = rows.find(r => String(r.id) === String(doctorId));
      if (doctor) {
        setSelectedIds(new Set([doctor.id]));
        setSelectedDoctorName(doctor.name);
      }
    }
  }, [doctorId, rows, loading]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(apiEndpoints.messages.doctorsForMessaging);
      if (response.data.success) {
        setRows(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      alert('Failed to fetch doctor data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let data = [...rows];
    const f = appliedFilters;
    if (f.status !== 'All') data = data.filter((r) => r.status === f.status);
    if (f.window) data = data.filter((r) => matchesDueWindow(r, f.window));
    if (f.search) {
      const q = f.search.toLowerCase();
      data = data.filter((r) =>
        r.name.toLowerCase().includes(q) || r.hospital.toLowerCase().includes(q)
      );
    }
    if (f.date) data = data.filter((r) => r.due === f.date);

    switch (f.sortBy) {
      case 'due-desc':
        data.sort((a, b) => a.due < b.due ? 1 : -1);
        break;
      case 'amount-desc':
        data.sort((a, b) => b.amount - a.amount);
        break;
      case 'amount-asc':
        data.sort((a, b) => a.amount - b.amount);
        break;
      default:
        data.sort((a, b) => a.due > b.due ? 1 : -1);
    }

    // Move selected doctor to the top if a specific doctor is selected
    if (doctorId && selectedIds.size > 0) {
      const selectedDoctorIndex = data.findIndex(r => String(r.id) === String(doctorId));
      if (selectedDoctorIndex > 0) {
        const [selectedDoctor] = data.splice(selectedDoctorIndex, 1);
        data.unshift(selectedDoctor);
      }
    }

    return data;
  }, [rows, appliedFilters, doctorId, selectedIds]);

  const allFilteredSelected = filtered.length > 0 && filtered.every((r) => selectedIds.has(r.id));

  function toggleOne(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleAllFiltered() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filtered.forEach((r) => next.delete(r.id));
      } else {
        filtered.forEach((r) => next.add(r.id));
      }
      return next;
    });
  }

  function applyFilters() {
    setAppliedFilters(filters);
  }

  function resetFilters() {
    const base = {
      status: 'All',
      search: '',
      window: 'All',
      sortBy: 'due-asc',
      date: '',
      channel: 'WhatsApp + Email'
    };
    setFilters(base);
    setAppliedFilters(base);
  }

  function previewSample() {
    const sample = filtered.find(r => selectedIds.has(r.id)) || filtered[0] || rows[0];
    if (!sample) return alert('No data to preview.');
    const text = body
      .replaceAll('{{name}}', sample.name)
      .replaceAll('{{status}}', sample.status)
      .replaceAll('{{emi_amount}}', currency(sample.amount))
      .replaceAll('{{emi_due}}', sample.due)
      .replaceAll('{{emi_days_left}}', `${Math.abs(sample.daysLeft)}d ${sample.daysLeft < 0 ? 'overdue' : 'left'}`);
    alert(`${appliedFilters.channel === 'Email only' ? `${subject}\n\n` : ''}${text}`);
  }

  async function handleSend() {
    if (selectedIds.size === 0) {
      return alert('Please select at least one recipient.');
    }

    if (!confirm(`Are you sure you want to send messages to ${selectedIds.size} selected doctors?`)) {
      return;
    }

    setSending(true);
    try {
      const payload = {
        recipientIds: Array.from(selectedIds),
        channel: appliedFilters.channel,
        subject: subject,
        body: body
      };

      const response = await apiClient.post(apiEndpoints.messages.sendBulkMessages, payload);

      if (response.data.success) {
        const { results } = response.data;
        alert(`Success!\nTotal: ${results.total}\nWhatsApp Sent: ${results.whatsapp.sent}\nEmail Sent: ${results.email.sent}\nFailed: ${results.whatsapp.failed + results.email.failed}`);
        setSelectedIds(new Set());
      }
    } catch (error) {
      console.error('Error sending messages:', error);
      alert('Error sending messages. Check console for details.');
    } finally {
      setSending(false);
    }
  }

  function handleExport() {
    alert('Export to Excel triggered.');
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="min-h-screen font-sans">
      {/* Sticky Filters */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-800">
                Send Message — WhatsApp & Email
                {doctorId && selectedDoctorName && (
                  <span className="block text-sm font-normal text-teal-700 mt-1">
                    Sending to: <span className="font-semibold">{selectedDoctorName}</span>
                    <button 
                      onClick={() => { setSelectedIds(new Set()); setSelectedDoctorName(''); }}
                      className="ml-3 text-xs text-red-600 hover:text-red-800 underline"
                    >
                      Clear selection
                    </button>
                  </span>
                )}
              </h1>
              <p className="text-slate-500 text-sm mt-1">Filter by status or due date range, sort, select, and send reminders. Export or print the filtered list.</p>
            </div>
            <button onClick={fetchDoctors} className="p-2 text-slate-500 hover:text-teal-600 transition-colors" title="Refresh Data">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-3">
            <select value={filters.status} onChange={(e) => setFilters((s) => ({ ...s, status: e.target.value }))} className="w-full rounded-md border-slate-200 text-sm px-2 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
              {STATUS_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
            </select>
            <input value={filters.search} onChange={(e) => setFilters((s) => ({ ...s, search: e.target.value }))} placeholder="e.g., Dr. Sharma" className="w-full rounded-md border-slate-200 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            <select value={filters.window} onChange={(e) => setFilters((s) => ({ ...s, window: e.target.value }))} className="w-full rounded-md border-slate-200 text-sm px-2 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
              {DUE_WINDOW_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
            </select>
            <select value={filters.sortBy} onChange={(e) => setFilters((s) => ({ ...s, sortBy: e.target.value }))} className="w-full rounded-md border-slate-200 text-sm px-2 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
              {SORT_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            <input type="date" value={filters.date} onChange={(e) => setFilters((s) => ({ ...s, date: e.target.value }))} className="w-full rounded-md border-slate-200 text-sm px-2 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            <select value={filters.channel} onChange={(e) => setFilters((s) => ({ ...s, channel: e.target.value }))} className="w-full rounded-md border-slate-200 text-sm px-2 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
              {CHANNEL_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
            </select>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button onClick={applyFilters} className="px-4 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Apply</button>
            <button onClick={resetFilters} className="px-4 py-2 text-sm rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200">Reset</button>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-slate-500">{loading ? 'Loading...' : `${filtered.length} filtered | ${selectedIds.size} selected`}</span>
              <button onClick={handleExport} className="px-3 py-2 text-sm rounded-md bg-sky-600 text-white hover:bg-sky-700">Export to Excel</button>
              <button onClick={handlePrint} className="px-3 py-2 text-sm rounded-md bg-slate-700 text-white hover:bg-slate-800">Print</button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6 grid grid-cols-1 lg:grid-cols-10 gap-4 md:gap-6">
        {/* Left - table */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-lg shadow-sm border min-h-[400px]">
            <div className="p-3 border-b flex items-center gap-3 text-sm">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={allFilteredSelected} onChange={toggleAllFiltered} disabled={loading} />
                <span>Select all (filtered)</span>
              </label>
            </div>
            <div className="overflow-x-auto relative">
              {loading && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
              )}
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-3 py-2 text-left w-8"></th>
                    <th className="px-3 py-2 text-left">Doctor</th>
                    <th className="px-3 py-2 text-left">Hospital</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">EMI Amount</th>
                    <th className="px-3 py-2 text-left">EMI Due</th>
                    <th className="px-3 py-2 text-left">Days Left</th>
                    <th className="px-3 py-2 text-left">Phone</th>
                    <th className="px-3 py-2 text-left">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && !loading ? (
                    <tr>
                      <td colSpan="9" className="px-3 py-10 text-center text-slate-400">No doctors found matching filters</td>
                    </tr>
                  ) : filtered.map((r) => {
                    const isSelected = selectedIds.has(r.id);
                    const isSpecificDoctor = doctorId && String(r.id) === String(doctorId);
                    return (
                    <tr key={r.id} className={`border-t hover:bg-slate-50 transition-colors ${
                      isSelected 
                        ? isSpecificDoctor
                          ? 'bg-teal-100 border-teal-300 ring-2 ring-teal-400'
                          : 'bg-teal-50/30'
                        : ''
                    }`}>
                      <td className="px-3 py-2 align-top">
                        <input type="checkbox" checked={isSelected} onChange={() => toggleOne(r.id)} />
                      </td>
                      <td className="px-3 py-2 align-top font-medium text-slate-800">
                        {r.name}
                        {isSpecificDoctor && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-600 text-white">
                            Selected
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 align-top text-slate-600">{r.hospital}</td>
                      <td className="px-3 py-2 align-top">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${STATUS_COLORS[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status}</span>
                      </td>
                      <td className="px-3 py-2 align-top">{currency(r.amount)}</td>
                      <td className="px-3 py-2 align-top text-slate-500">{r.due}</td>
                      <td className="px-3 py-2 align-top">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${r.daysLeft < 0 ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'}`}>
                          {Math.abs(r.daysLeft)}d {r.daysLeft < 0 ? 'overdue' : 'left'}
                        </span>
                      </td>
                      <td className="px-3 py-2 align-top text-slate-500">{r.phone}</td>
                      <td className="px-3 py-2 align-top text-slate-500">{r.email}</td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right - message panel */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-40">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-800">Message</h3>
              <span className="text-xs text-slate-500">Channel: {appliedFilters.channel}</span>
            </div>

            <label className="block text-xs font-medium text-slate-600">Subject (for Email)</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., EMI reminder — Rapid Medico" className="mt-1 w-full rounded-md border-slate-200 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />

            <label className="block text-xs font-medium text-slate-600 mt-3">Message Body</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} className="mt-1 w-full rounded-md border-slate-200 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            <div className="mt-2 p-2 bg-slate-50 rounded text-[10px] text-slate-500 leading-relaxed">
              <strong>Available Variables:</strong><br />
              <span className="cursor-pointer hover:text-teal-600" onClick={() => setBody(prev => prev + '{{name}}')}>{'{{name}}'}</span>,
              <span className="cursor-pointer hover:text-teal-600" onClick={() => setBody(prev => prev + '{{status}}')}>{'{{status}}'}</span>,
              <span className="cursor-pointer hover:text-teal-600" onClick={() => setBody(prev => prev + '{{emi_amount}}')}>{'{{emi_amount}}'}</span>,
              <span className="cursor-pointer hover:text-teal-600" onClick={() => setBody(prev => prev + '{{emi_due}}')}>{'{{emi_due}}'}</span>,
              <span className="cursor-pointer hover:text-teal-600" onClick={() => setBody(prev => prev + '{{emi_days_left}}')}>{'{{emi_days_left}}'}</span>
            </div>

            <label className="block text-xs font-medium text-slate-600 mt-3">Attachment (Email only)</label>
            <div className="mt-1 flex items-center gap-3">
              <label className="inline-flex items-center px-3 py-2 text-sm rounded-md bg-slate-100 hover:bg-slate-200 cursor-pointer">
                <input type="file" className="hidden" onChange={(e) => setAttachmentName(e.target.files?.[0]?.name || '')} />
                Choose File
              </label>
              <span className="text-xs text-slate-500 truncate max-w-[120px]">{attachmentName || 'No file chosen'}</span>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={handleSend}
                disabled={sending || selectedIds.size === 0}
                className={`w-full py-2.5 text-sm font-medium rounded-md transition-all ${sending ? 'bg-slate-400 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm active:scale-[0.98]'}`}
              >
                {sending ? 'Sending...' : (
                  doctorId && selectedDoctorName
                    ? `Send to ${selectedDoctorName}`
                    : `Send to ${selectedIds.size} SELECTED`
                )}
              </button>
              <button onClick={previewSample} className="w-full py-2 text-sm rounded-md bg-amber-500 text-white hover:bg-amber-600 transition-colors">Preview Sample</button>
              <button
                onClick={() => { setSubject('EMI reminder — Rapid Medico'); setBody('Hi {{name}},\nYour monthly EMI of {{emi_amount}} is due on {{emi_due}} ({{emi_days_left}} days).\nPlease pay to avoid interruption.'); setAttachmentName(''); }}
                className="w-full py-2 text-sm rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                disabled={sending}
              >
                Reset Template
              </button>
            </div>

            <div className="mt-4 text-[10px] text-slate-400 leading-tight">
              * WhatsApp uses only the body text and special templates. Email uses subject + body + attachment.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
