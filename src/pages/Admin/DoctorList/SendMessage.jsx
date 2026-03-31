import React, { useMemo, useState, useEffect, useCallback } from 'react';
import apiClient, { apiEndpoints } from '../../../services/apiClient';

const STATUS_COLORS = {
  Hot: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
  Cold: 'bg-teal-100 text-teal-700 ring-1 ring-teal-200',
  Close: 'bg-sky-100 text-sky-700 ring-1 ring-sky-200'
};

const DUE_WINDOW_OPTIONS = ['All', 'Today', 'Due Soon', 'Overdue', 'Upcoming', 'This Month'];
const STATUS_OPTIONS = ['All', 'Hot', 'Cold', 'Close'];
const SORT_OPTIONS = [
  { value: 'due-asc', label: 'EMI Due — Soonest' },
  { value: 'due-desc', label: 'EMI Due — Oldest' },
  { value: 'amount-desc', label: 'Amount — High to Low' },
  { value: 'amount-asc', label: 'Amount — Low to High' }
];
const CHANNEL_OPTIONS = ['WhatsApp + Email', 'Email only', 'WhatsApp only', 'SMS only', 'WhatsApp + SMS'];

function currency(amount) {
  return `₹${(amount || 0).toLocaleString('en-IN')}`;
}

export default function SendMessage() {
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
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [subject, setSubject] = useState('EMI reminder — Rapid Medico');
  const [body, setBody] = useState(
    'Hi {{name}},\nYour monthly EMI of {{emi_amount}} is due on {{emi_due}} ({{emi_days_left}} days).\nPlease pay to avoid interruption.'
  );
  const [attachmentName, setAttachmentName] = useState('');

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        status: appliedFilters.status !== 'All' ? appliedFilters.status : undefined,
        search: appliedFilters.search || undefined,
        window: appliedFilters.window !== 'All' ? appliedFilters.window : undefined,
        date: appliedFilters.date || undefined,
        sortBy: appliedFilters.sortBy
      };

      const response = await apiClient.get(apiEndpoints.messages.doctorsForMessaging, { params });
      if (response.data.success) {
        setRows(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const filtered = useMemo(() => {
    let data = [...rows];
    const f = appliedFilters;
    // Backend handles filtering, frontend handles sorting
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
    return data;
  }, [rows, appliedFilters.sortBy]);

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
    const sample = filtered[0] || rows[0];
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
    if (selectedIds.size === 0) return alert('Please select at least one recipient.');
    if (!window.confirm(`Send messages to ${selectedIds.size} recipients via ${appliedFilters.channel}?`)) return;

    setSending(true);
    try {
      const response = await apiClient.post(apiEndpoints.messages.sendBulkMessages, {
        recipientIds: Array.from(selectedIds),
        channel: appliedFilters.channel,
        subject,
        body
      });

      if (response.data.success) {
        const res = response.data.results;
        alert(`Successfully sent bulk messages!\n\nWhatsApp: ${res.whatsapp.sent}/${res.whatsapp.sent + res.whatsapp.failed}\nSMS: ${res.sms.sent}/${res.sms.sent + res.sms.failed}\nEmail: ${res.email.sent}/${res.email.sent + res.email.failed}`);
        setSelectedIds(new Set());
      } else {
        alert('Error: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error sending messages:', error);
      alert('Failed to send messages. Please check logs.');
    } finally {
      setSending(false);
    }
  }

  function handleExport() {
    alert('Export to Excel triggered. (Demo stub)');
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="min-h-screen font-sans">
      {/* Sticky Filters */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-4">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800">Send Message — Multi-Channel Bulk Messaging</h1>
          <p className="text-slate-500 text-sm mt-1">Filter by status or due date range, sort, select, and send reminders via WhatsApp, SMS, or Email.</p>

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
            <button onClick={applyFilters} disabled={loading} className="px-4 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
              {loading ? 'Filtering...' : 'Apply'}
            </button>
            <button onClick={resetFilters} disabled={loading} className="px-4 py-2 text-sm rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200">Reset</button>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-slate-500">{loading ? 'Loading...' : `${filtered.length} matches | ${selectedIds.size} selected`}</span>
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
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-3 border-b flex items-center gap-3 text-sm bg-slate-50/50">
              <label className="inline-flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
                <input type="checkbox" checked={allFilteredSelected} onChange={toggleAllFiltered} className="rounded text-emerald-600 focus:ring-emerald-500" />
                <span>Select all visible ({filtered.length})</span>
              </label>
            </div>
            <div className="overflow-x-auto min-h-[400px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-2"></div>
                  <p>Searching doctors...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center px-4">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="font-medium">No results found for these filters.</p>
                  <p className="text-sm">Try broadening your search or window.</p>
                </div>
              ) : (
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600 border-b">
                    <tr>
                      <th className="px-3 py-3 text-left w-8"></th>
                      <th className="px-3 py-3 text-left">Doctor</th>
                      <th className="px-3 py-3 text-left">Hospital</th>
                      <th className="px-3 py-3 text-left">Status</th>
                      <th className="px-3 py-3 text-left text-right">Amount</th>
                      <th className="px-3 py-3 text-left">Due Date</th>
                      <th className="px-3 py-3 text-left">Days</th>
                      <th className="px-3 py-3 text-left">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.map((r) => (
                      <tr key={r.id} className={`hover:bg-slate-50/80 transition-colors ${selectedIds.has(r.id) ? 'bg-emerald-50/30' : ''}`}>
                        <td className="px-3 py-3">
                          <input type="checkbox" checked={selectedIds.has(r.id)} onChange={() => toggleOne(r.id)} className="rounded text-emerald-600 focus:ring-emerald-500" />
                        </td>
                        <td className="px-3 py-3 font-medium text-slate-800">{r.name}</td>
                        <td className="px-3 py-3 text-slate-600 truncate max-w-[150px]">{r.hospital}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${STATUS_COLORS[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status}</span>
                        </td>
                        <td className="px-3 py-3 text-right font-mono font-medium text-slate-700">{currency(r.amount)}</td>
                        <td className="px-3 py-3 text-slate-600 whitespace-nowrap">{r.due}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold ${r.daysLeft < 0 ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'}`}>
                            {Math.abs(r.daysLeft)}d {r.daysLeft < 0 ? 'late' : 'left'}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-slate-500 font-mono text-xs">{r.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right - message panel */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-[156px]">
            <div className="flex items-center justify-between mb-3 pb-3 border-b">
              <h3 className="font-semibold text-slate-800">Message Panel</h3>
              <span className="text-[10px] font-bold uppercase py-1 px-2 bg-slate-100 text-slate-600 rounded">{appliedFilters.channel}</span>
            </div>

            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-tight">Subject (for Email)</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., EMI reminder — Rapid Medico" className="mt-1 w-full rounded-md border-slate-200 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />

            <label className="block text-xs font-semibold text-slate-500 mt-4 uppercase tracking-tight">Body Content</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} className="mt-1 w-full rounded-md border-slate-200 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed" />
            <div className="flex flex-wrap gap-1 mt-2">
              {['{{name}}', '{{emi_amount}}', '{{emi_due}}', '{{emi_days_left}}'].map(v => (
                <button key={v} onClick={() => setBody(prev => prev + v)} className="text-[9px] font-bold bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded hover:text-slate-600 border">{v}</button>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <button
                onClick={handleSend}
                disabled={sending || selectedIds.size === 0 || loading}
                className="w-full py-2.5 text-sm font-semibold rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : `Send to ${selectedIds.size} Recipients`}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={previewSample} className="py-2 text-xs font-medium rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200">Preview</button>
                <button onClick={() => { setSubject('EMI reminder — Rapid Medico'); setBody('Hi {{name}},\nYour monthly EMI of {{emi_amount}} is due on {{emi_due}} ({{emi_days_left}} days).\nPlease pay to avoid interruption.'); setAttachmentName(''); }} className="py-2 text-xs font-medium rounded-md bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200">Reset</button>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-md border text-[10px] text-slate-500 leading-relaxed">
              <strong>Info:</strong> WhatsApp & SMS use only the body text. Email uses subject + body. Variables are replaced automatically for each recipient.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



