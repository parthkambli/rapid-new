import React, { useMemo, useState } from 'react';

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

const initialRows = [
  { id: 1, name: 'Dr. Amit Sharma', hospital: 'Care Hospital', status: 'Hot', amount: 899, due: '2025-09-26', daysLeft: -20, phone: '919000000000', email: 'dramitsharma@example.com' },
  { id: 2, name: 'Dr. C. Rao', hospital: 'Metro Hospital', status: 'Close', amount: 899, due: '2025-09-26', daysLeft: -20, phone: '919000000040', email: 'drcrao@example.com' },
  { id: 3, name: 'Dr. Nisha Rao', hospital: 'City Medico', status: 'Close', amount: 1199, due: '2025-09-27', daysLeft: -19, phone: '919000000041', email: 'drnisharao@example.com' },
  { id: 4, name: 'Dr. L. Jadhav', hospital: 'CureWell', status: 'Cold', amount: 1199, due: '2025-09-27', daysLeft: -19, phone: '919000000042', email: 'drljadhav@example.com' },
  { id: 5, name: 'Dr. Kavita Joshi', hospital: 'Sunrise Clinic', status: 'Cold', amount: 1499, due: '2025-09-28', daysLeft: -18, phone: '919000000002', email: 'drkavitajoshi@example.com' },
  { id: 6, name: 'Dr. B. Saluja', hospital: 'Care Hospital', status: 'Hot', amount: 1499, due: '2025-09-28', daysLeft: -18, phone: '919000000042', email: 'drbsaluja@example.com' },
  { id: 7, name: 'Dr. Rahul Verma', hospital: 'Rapid Health', status: 'Hot', amount: 1999, due: '2025-09-29', daysLeft: -17, phone: '919000000043', email: 'drrahulverma@example.com' },
  { id: 8, name: 'Dr. R. Desai', hospital: 'City Medico', status: 'Close', amount: 1999, due: '2025-09-29', daysLeft: -17, phone: '919000000044', email: 'drrdesai@example.com' },
  { id: 9, name: 'Dr. P. Mehta', hospital: 'Metro Hospital', status: 'Cold', amount: 999, due: '2025-10-03', daysLeft: 5, phone: '919000000045', email: 'drpmehta@example.com' },
  { id: 10, name: 'Dr. K. Iyer', hospital: 'CureWell', status: 'Close', amount: 1299, due: '2025-10-10', daysLeft: 12, phone: '919000000046', email: 'drkiyer@example.com' }
];

function currency(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

function matchesDueWindow(item, win) {
  if (win === 'All') return true;
  if (win === 'Overdue') return item.daysLeft < 0;
  if (win === 'Due Soon') return item.daysLeft >= 0 && item.daysLeft <= 7;
  if (win === 'Upcoming') return item.daysLeft > 7;
  return true;
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
  const [rows] = useState(initialRows);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [subject, setSubject] = useState('EMI reminder — Rapid Medico');
  const [body, setBody] = useState(
    'Hi {{name}},\nYour monthly EMI of {{emi_amount}} is due on {{emi_due}} ({{emi_days_left}} days).\nPlease pay to avoid interruption.'
  );
  const [attachmentName, setAttachmentName] = useState('');

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
    return data;
  }, [rows, appliedFilters]);

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

  function handleSend() {
    alert(`Sending ${selectedIds.size || 0} messages via ${appliedFilters.channel}. (Demo stub)`);
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
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800">Send Message — WhatsApp & Email</h1>
          <p className="text-slate-500 text-sm mt-1">Filter by status or due date range, sort, select, and send reminders. Export or print the filtered list.</p>

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
              <span className="text-xs text-slate-500">{filtered.length} filtered | {selectedIds.size} selected</span>
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
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-3 border-b flex items-center gap-3 text-sm">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={allFilteredSelected} onChange={toggleAllFiltered} />
                <span>Select all (filtered)</span>
              </label>
            </div>
            <div className="overflow-x-auto">
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
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-t hover:bg-slate-50">
                      <td className="px-3 py-2 align-top">
                        <input type="checkbox" checked={selectedIds.has(r.id)} onChange={() => toggleOne(r.id)} />
                      </td>
                      <td className="px-3 py-2 align-top font-medium text-slate-800">{r.name}</td>
                      <td className="px-3 py-2 align-top text-slate-600">{r.hospital}</td>
                      <td className="px-3 py-2 align-top">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                      </td>
                      <td className="px-3 py-2 align-top">{currency(r.amount)}</td>
                      <td className="px-3 py-2 align-top">{r.due}</td>
                      <td className="px-3 py-2 align-top">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${r.daysLeft < 0 ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'}`}>
                          {Math.abs(r.daysLeft)}d {r.daysLeft < 0 ? 'overdue' : 'left'}
                        </span>
                      </td>
                      <td className="px-3 py-2 align-top text-slate-600">{r.phone}</td>
                      <td className="px-3 py-2 align-top text-slate-600">{r.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right - message panel */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-800">Message</h3>
              <span className="text-xs text-slate-500">Channel: {appliedFilters.channel}</span>
            </div>

            <label className="block text-xs font-medium text-slate-600">Subject (for Email)</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., EMI reminder — Rapid Medico" className="mt-1 w-full rounded-md border-slate-200 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />

            <label className="block text-xs font-medium text-slate-600 mt-3">Message</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} className="mt-1 w-full rounded-md border-slate-200 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            <p className="text-[11px] text-slate-500 mt-1">Vars: {'{{name}}'} {'{{status}}'} {'{{emi_amount}}'} {'{{emi_due}}'} {'{{emi_days_left}}'}</p>

            <label className="block text-xs font-medium text-slate-600 mt-3">Attachment (Email only)</label>
            <div className="mt-1 flex items-center gap-3">
              <label className="inline-flex items-center px-3 py-2 text-sm rounded-md bg-slate-100 hover:bg-slate-200 cursor-pointer">
                <input type="file" className="hidden" onChange={(e) => setAttachmentName(e.target.files?.[0]?.name || '')} />
                Choose File
              </label>
              <span className="text-xs text-slate-500 truncate">{attachmentName || 'No file chosen'}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={handleSend} className="px-4 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Send</button>
              <button onClick={previewSample} className="px-4 py-2 text-sm rounded-md bg-amber-500 text-white hover:bg-amber-600">Preview Sample</button>
              <button onClick={() => { setSubject('EMI reminder — Rapid Medico'); setBody('Hi {{name}},\nYour monthly EMI of {{emi_amount}} is due on {{emi_due}} ({{emi_days_left}} days).\nPlease pay to avoid interruption.'); setAttachmentName(''); }} className="px-4 py-2 text-sm rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200">Clear</button>
            </div>

            <div className="mt-4 text-[11px] text-slate-500">
              WhatsApp uses only the body text. Email uses subject + body + optional attachment.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



