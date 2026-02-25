// src/components/FiltersSection.jsx
import React from "react";
import { Calendar } from "lucide-react";

const statusOptions = ["Hot", "Warm", "Cold", "Closed"];
const membershipOptions = ["Hospital", "Clinic", "Individual"];

export default function FiltersSection({ filters, onFilterChange }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      {/* Row 1 */}
      <div className="grid grid-cols-5 gap-3 mb-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Search By Dr Name
          </label>
          <input
            type="text"
            placeholder="Doctor name..."
            value={filters.drName}
            onChange={(e) => onFilterChange("drName", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Sort by Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All</option>
            {statusOptions.map((status) => (
              <option key={status} value={status.toLowerCase()}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">From Date</label>
          <div className="relative">
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => onFilterChange("fromDate", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-700 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">To Date</label>
          <div className="relative">
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => onFilterChange("toDate", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-700 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Sort by Membership
          </label>
          <select
            value={filters.membership}
            onChange={(e) => onFilterChange("membership", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All</option>
            {membershipOptions.map((membership) => (
              <option key={membership} value={membership.toLowerCase()}>
                {membership}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-5 gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Search By City
          </label>
          <input
            type="text"
            value={filters.city}
            onChange={(e) => onFilterChange("city", e.target.value)}
            placeholder="Enter city"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Search By Employee
          </label>
          <input
            type="text"
            value={filters.employeeName}
            onChange={(e) => onFilterChange("employeeName", e.target.value)}
            placeholder="Employee name..."
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Search By Speciality
          </label>
          <input
            type="text"
            value={filters.specialty}
            onChange={(e) => onFilterChange("specialty", e.target.value)}
            placeholder="Speciality"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
