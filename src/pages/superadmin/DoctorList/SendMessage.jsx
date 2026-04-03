import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import apiClient, { apiEndpoints } from '../../../services/apiClient';

// ─── Constants ────────────────────────────────────────────────────────────────

const REMINDER_TYPES = [
  { value: 'installment', label: '💰 Installment Reminders' },
  { value: 'service_pre_renewal', label: '🔔 Service Pre-Renewal (Upcoming)' },
  { value: 'service_renewal', label: '⚠️ Service Renewal (Overdue)' },
];

const DUE_WINDOWS = {
  installment: [
    { value: 'All', label: 'All' },
    { value: 'Today', label: 'Today' },
    { value: 'Due Soon', label: 'Due Soon (≤7 days)' },
    { value: 'This Month', label: 'This Month (≤30 days)' },
    { value: 'Upcoming', label: 'Upcoming (>7 days)' },
    { value: 'Overdue', label: 'Overdue' },
  ],
  service_pre_renewal: [
    { value: 'All', label: 'All' },
    { value: '15 Days', label: '15 Days Left' },
    { value: '7 Days', label: '7 Days Left' },
    { value: '3 Days', label: '3 Days Left' },
    { value: '2 Days', label: '2 Days Left' },
    { value: 'Same Day', label: 'Expiring Today' },
  ],
  service_renewal: [
    { value: 'All', label: 'All Overdue' },
    { value: '8 Days Overdue', label: '8 Days Overdue' },
    { value: '20 Days Overdue', label: '20 Days Overdue' },
    { value: '30 Days Overdue', label: '30 Days Overdue' },
  ],
};

const STATUS_OPTIONS = [
  { value: 'All', label: 'All Status' },
  { value: 'hot', label: 'Hot' },
  { value: 'cold', label: 'Cold' },
  { value: 'close', label: 'Closed' },
];

const SORT_OPTIONS = [
  { value: 'due-asc', label: 'Due Date — Soonest' },
  { value: 'due-desc', label: 'Due Date — Latest' },
  { value: 'amount-desc', label: 'Amount — High to Low' },
  { value: 'amount-asc', label: 'Amount — Low to High' },
  { value: 'overdue-desc', label: 'Most Overdue First' },
];

const CHANNEL_OPTIONS = [
  'WhatsApp only',
  'SMS only',
  'WhatsApp + SMS',
  // 'Email only',
  // 'WhatsApp + Email',
];

const STATUS_COLORS = {
  hot: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
  cold: 'bg-sky-100 text-sky-700 ring-1 ring-sky-200',
  close: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
};

function currency(v) {
  return `₹${(v || 0).toLocaleString('en-IN')}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

export default function SuperAdminSendMessage() {
  const { doctorId } = useParams();
  const [reminderType, setReminderType] = useState('installment');
  const [filters, setFilters] = useState({
    status: 'All',
    search: '',
    dueWindow: 'All',
    sortBy: 'due-asc',
    date: '',
    channel: 'WhatsApp only',
  });
  const [appliedFilters, setAppliedFilters] = useState({ ...filters, reminderType: 'installment' });

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedDoctorName, setSelectedDoctorName] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Template state
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [subject, setSubject] = useState('Reminder — Rapid Medico-Legal Services');

  // ── Fetch templates from backend ──────────────────────────────────────────
  const fetchTemplates = useCallback(async (type) => {
    try {
      const res = await apiClient.get(apiEndpoints.messages.getTemplates, {
        params: { reminderType: type }
      });
      if (res.data.success) {
        const list = res.data.data || [];
        setTemplates(list);
        setSelectedTemplate(list[0] || null);
      }
    } catch (e) {
      console.error('Error fetching templates:', e);
    }
  }, []);

  // ── Fetch doctors ─────────────────────────────────────────────────────────
  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        reminderType: appliedFilters.reminderType,
        status: appliedFilters.status !== 'All' ? appliedFilters.status : undefined,
        search: appliedFilters.search || undefined,
        dueWindow: appliedFilters.dueWindow !== 'All' ? appliedFilters.dueWindow : undefined,
        date: appliedFilters.date || undefined,
      };
      const res = await apiClient.get(apiEndpoints.messages.doctorsForMessaging, { params });
      if (res.data.success) {
        const data = res.data.data || [];
        setRows(data);
      }
    } catch (e) {
      console.error('Error fetching doctors:', e);
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => { fetchTemplates(reminderType); }, [reminderType, fetchTemplates]);
  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  // ── Deep linking from doctor list ─────────────────────────────────────────
  useEffect(() => {
    if (doctorId && rows.length > 0 && !loading) {
      const doctor = rows.find(r => r.id?.toString() === doctorId.toString());
      if (doctor) {
        setSelectedIds(new Set([doctor.id.toString()]));
        setSelectedDoctorName(doctor.name);
      }
    }
  }, [doctorId, rows, loading]);

  // ── Sorting (client-side) ─────────────────────────────────────────────────
  const sorted = useMemo(() => {
    let data = [...rows];

    // Sort logic
    switch (appliedFilters.sortBy) {
      case 'due-desc': data.sort((a, b) => (a.due < b.due ? 1 : -1)); break;
      case 'amount-desc': data.sort((a, b) => b.amount - a.amount); break;
      case 'amount-asc': data.sort((a, b) => a.amount - b.amount); break;
      case 'overdue-desc': data.sort((a, b) => (a.daysLeft || 0) - (b.daysLeft || 0)); break;
      default: data.sort((a, b) => (a.due > b.due ? 1 : -1));
    }

    // Move pre-selected doctor to top
    if (doctorId && selectedIds.has(doctorId.toString())) {
      const idx = data.findIndex(r => r.id?.toString() === doctorId.toString());
      if (idx > 0) {
        const [target] = data.splice(idx, 1);
        data.unshift(target);
      }
    }

    return data;
  }, [rows, appliedFilters.sortBy, doctorId, selectedIds]);

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginatedRows = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(currentPage * PAGE_SIZE, sorted.length);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  const allSelected = paginatedRows.length > 0 && paginatedRows.every(r => selectedIds.has(r.id.toString()));

  function toggleOne(id) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      const key = id.toString();
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  function toggleAll() {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allSelected) sorted.forEach(r => next.delete(r.id.toString()));
      else sorted.forEach(r => next.add(r.id.toString()));
      return next;
    });
  }

  function applyFilters() {
    setAppliedFilters({ ...filters, reminderType });
    setSelectedIds(new Set());
    setSelectedDoctorName('');
  }

  function resetFilters() {
    const base = { status: 'All', search: '', dueWindow: 'All', sortBy: 'due-asc', date: '', channel: 'WhatsApp only' };
    setFilters(base);
    setAppliedFilters({ ...base, reminderType: 'installment' });
    setReminderType('installment');
    setSelectedIds(new Set());
    setSelectedDoctorName('');
  }

  function handleReminderTypeChange(val) {
    setReminderType(val);
    setFilters(f => ({ ...f, dueWindow: 'All' }));
    setSelectedIds(new Set());
    setSelectedDoctorName('');
  }

  // ── Send ──────────────────────────────────────────────────────────────────
  async function handleSend() {
    if (selectedIds.size === 0) return alert('Please select at least one recipient.');
    if (!selectedTemplate) return alert('Please select a template first.');
    if (!window.confirm(`Send "${selectedTemplate.label}" via ${filters.channel} to ${selectedIds.size} recipients?`)) return;

    setSending(true);
    try {
      const res = await apiClient.post(apiEndpoints.messages.sendBulkMessages, {
        recipientIds: Array.from(selectedIds),
        channel: filters.channel,
        templateId: selectedTemplate.id,
        subject,
        body: selectedTemplate.body,
      });

      if (res.data.success) {
        const r = res.data.results;
        alert(
          `✅ Messages sent!\n\n` +
          `WhatsApp: ${r.whatsapp.sent} sent / ${r.whatsapp.failed} failed\n` +
          `SMS: ${r.sms.sent} sent / ${r.sms.failed} failed\n` +
          `Email: ${r.email.sent} sent / ${r.email.failed} failed`
        );
        setSelectedIds(new Set());
      } else {
        alert('Error: ' + res.data.message);
      }
    } catch (e) {
      console.error('Send error:', e);
      alert('Failed to send messages. Check server logs.');
    } finally {
      setSending(false);
    }
  }

  function handleExportCSV() {
    if (sorted.length === 0) return alert('No data to export.');
    const headers = ['Name', 'Hospital', 'Status', 'Amount', 'Due Date', 'Days', 'Phone', 'WhatsApp', 'Email'];
    const csvRows = [
      headers.join(','),
      ...sorted.map(r =>
        [r.name, r.hospital, r.status, r.amount, r.due, r.daysLeft, r.phone, r.whatsapp, r.email]
          .map(v => `"${v}"`)
          .join(',')
      )
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `messaging_list_${reminderType}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const dueWindowsForType = DUE_WINDOWS[reminderType] || DUE_WINDOWS.installment;
  const selectedCount = selectedIds.size;

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── Header + Filters ──────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h1 className="text-lg font-bold text-slate-800">
                Send Message — WhatsApp &amp; SMS (Superadmin)
                {doctorId && selectedDoctorName && (
                  <span className="ml-3 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded uppercase font-bold tracking-wider align-middle">
                    Linked: {selectedDoctorName}
                  </span>
                )}
              </h1>
              <p className="text-xs text-slate-500">Unified messaging for installments and renewals.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={fetchDoctors} className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors" title="Refresh">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button onClick={handleExportCSV} className="px-3 py-1.5 text-xs font-medium rounded-md bg-sky-600 text-white hover:bg-sky-700">
                ⬇ Export CSV
              </button>
            </div>
          </div>

          <div className="mt-3 flex gap-1 flex-wrap">
            {REMINDER_TYPES.map(rt => (
              <button
                key={rt.value}
                onClick={() => handleReminderTypeChange(rt.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${reminderType === rt.value
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {rt.label}
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} className="rounded-md border border-slate-200 text-sm px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <input value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} onKeyDown={e => e.key === 'Enter' && applyFilters()} placeholder="Search doctor / hospital…" className="rounded-md border border-slate-200 text-sm px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <select value={filters.dueWindow} onChange={e => setFilters(f => ({ ...f, dueWindow: e.target.value }))} className="rounded-md border border-slate-200 text-sm px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {dueWindowsForType.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={filters.sortBy} onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value }))} className="rounded-md border border-slate-200 text-sm px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <input type="date" value={filters.date} onChange={e => setFilters(f => ({ ...f, date: e.target.value }))} className="rounded-md border border-slate-200 text-sm px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <select value={filters.channel} onChange={e => setFilters(f => ({ ...f, channel: e.target.value }))} className="rounded-md border border-slate-200 text-sm px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {CHANNEL_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <button onClick={applyFilters} disabled={loading} className="px-4 py-1.5 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 font-medium">
              {loading ? '⏳ Loading…' : 'Apply Filters'}
            </button>
            <button onClick={resetFilters} disabled={loading} className="px-4 py-1.5 text-sm rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200">Reset</button>
            <span className="ml-auto text-xs text-slate-500">
              {loading ? 'Fetching…' : (
                <>
                  {sorted.length > 0 && `Showing ${startIdx}–${endIdx} of ${sorted.length} results`}
                  {selectedCount > 0 && ` | ${selectedCount} selected`}
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 py-5 grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Table Section - Takes 9 columns on large screens */}
        <div className="xl:col-span-9">
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="px-4 py-2 bg-slate-50 border-b flex items-center justify-between gap-3 text-sm">
              <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded text-emerald-600 focus:ring-emerald-500" />
                <span>Select all visible ({paginatedRows.length})</span>
              </label>
              {totalPages > 1 && (
                <span className="text-xs text-slate-500">Page {currentPage} of {totalPages}</span>
              )}
            </div>
            <div className="overflow-x-auto" style={{ maxHeight: 'calc(100vh - 420px)' }}>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                  <div className="animate-spin h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full mb-3" />
                  <p className="text-sm">Loading doctors…</p>
                </div>
              ) : sorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400 text-center px-4">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="font-medium text-slate-600">No results found</p>
                </div>
              ) : (
                <div style={{ minWidth: '900px' }}>
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b sticky top-0 z-10">
                      <tr>
                        <th className="px-3 py-3 w-8" />
                        <th className="px-3 py-3 text-left">Doctor</th>
                        <th className="px-3 py-3 text-left">Hospital</th>
                        <th className="px-3 py-3 text-left">Status</th>
                        <th className="px-3 py-3 text-right">Amount</th>
                        <th className="px-3 py-3 text-left">Due</th>
                        <th className="px-3 py-3 text-left">Days</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedRows.map(r => {
                        const isSelected = selectedIds.has(r.id.toString());
                        return (
                          <tr key={r.id.toString()} onClick={() => toggleOne(r.id)} className={`cursor-pointer hover:bg-slate-50 transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}>
                            <td className="px-3 py-3">
                              <input type="checkbox" checked={isSelected} onChange={() => toggleOne(r.id)} onClick={e => e.stopPropagation()} className="rounded text-emerald-600 focus:ring-emerald-500" />
                            </td>
                            <td className="px-3 py-3 font-medium text-slate-800 whitespace-nowrap">{r.name}</td>
                            <td className="px-3 py-3 text-slate-500 truncate max-w-[200px]">{r.hospital}</td>
                            <td className="px-3 py-3 font-bold">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase ${STATUS_COLORS[r.status] || 'bg-slate-100 text-slate-500'}`}>{r.status}</span>
                            </td>
                            <td className="px-3 py-3 text-right font-mono font-semibold text-slate-700">{currency(r.amount)}</td>
                            <td className="px-3 py-3 text-slate-600 whitespace-nowrap">{r.due}</td>
                            <td className="px-3 py-3">
                              {r.daysLeft !== null ? (
                                <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${r.daysLeft < 0 ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'}`}>
                                  {r.daysLeft < 0 ? `${Math.abs(r.daysLeft)}d late` : `${r.daysLeft}d left`}
                                </span>
                              ) : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-4 py-3 bg-slate-50 border-t flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 text-xs rounded-md bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ⏮ First
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-1 text-xs rounded-md bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ◀ Prev
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 text-xs rounded-md font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 text-xs rounded-md bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next ▶
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 text-xs rounded-md bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Last ⏭
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message Panel - Takes 3 columns on large screens, sticky */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-xl border shadow-sm p-4 sticky top-24">
            <div className="flex items-center justify-between mb-3 pb-3 border-b">
              <h3 className="font-semibold text-slate-800">Message Panel</h3>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded">{filters.channel}</span>
            </div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-tight mb-1">Template</label>
            {templates.length === 0 ? <p className="text-xs text-slate-400 italic">No templates.</p> : (
              <select value={selectedTemplate?.id || ''} onChange={e => setSelectedTemplate(templates.find(t => t.id === e.target.value) || null)} className="w-full rounded-md border border-slate-200 text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                {templates.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            )}
            {selectedTemplate && (
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border text-xs text-slate-600 leading-relaxed">
                <p className="font-semibold text-slate-700 mb-1">📋 Preview</p>
                <p className="whitespace-pre-wrap italic opacity-80">{selectedTemplate.body}</p>
                {selectedTemplate.vars?.length > 0 && (
                  <div className="mt-2 pt-2 border-t flex flex-wrap gap-1">
                    {selectedTemplate.vars.map(v => <span key={v} className="px-1 bg-amber-100 text-amber-700 rounded text-[9px] font-mono">{`{{${v}}}`}</span>)}
                  </div>
                )}
              </div>
            )}
            {filters.channel.includes('Email') && (
              <><label className="block text-xs font-semibold text-slate-500 uppercase mt-4 mb-1">Email Subject</label>
                <input value={subject} onChange={e => setSubject(e.target.value)} className="w-full rounded-md border border-slate-200 text-sm px-3 py-2" /></>
            )}
            <div className="mt-5 space-y-2">
              <button onClick={handleSend} disabled={sending || selectedCount === 0 || !selectedTemplate || loading} className="w-full py-2.5 text-sm font-bold rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 transition-colors">
                {sending ? 'Sending…' : `Send to ${selectedCount} recipients`}
              </button>
              <button onClick={() => setSelectedIds(new Set())} disabled={selectedCount === 0} className="w-full py-2 text-xs font-medium rounded-md bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 disabled:opacity-40">Clear Selection</button>
            </div>
            <p className="mt-3 text-[10px] text-slate-400 leading-relaxed italic">All variables are substituted automatically per recipient on send.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
