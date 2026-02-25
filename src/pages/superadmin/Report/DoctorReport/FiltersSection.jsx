// src/components/FiltersSection.jsx
import React from 'react';
import { Calendar } from 'lucide-react';

export default function FiltersSection() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      {/* Row 1 */}
      <div className="grid grid-cols-5 gap-3 mb-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Search By Dr</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option>All</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Sort by Status</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option>Hot</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Sort by Date</label>
          <div className="relative">
            <input type="text" placeholder="To Date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1 opacity-0">.</label>
          <div className="relative">
            <input type="text" placeholder="From Date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Sort by Membership</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option>Hospital</option>
          </select>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-5 gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Search By City</label>
          <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Search By Employee</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option>Salesmen</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Search By Speciality</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option>Dental</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Search By Month</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option>March</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Search By Year</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option>2026</option>
          </select>
        </div>
      </div>
    </div>
  );
}