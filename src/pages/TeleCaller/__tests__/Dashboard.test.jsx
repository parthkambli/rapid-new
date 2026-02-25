import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../Dashboard';

// Mock the apiClient module
jest.mock('../../../services/apiClient', () => ({
  apiEndpoints: {
    doctors: {
      myDoctors: '/api/doctors/my-doctors',
    },
    alerts: {
      myAlerts: '/api/alerts/my-alerts',
    },
    quotations: {
      myQuotations: '/api/quotations/my-quotations',
    },
    reports: {
      dashboard: '/api/reports/dashboard',
    },
  },
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock the toast module
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock the Table component
jest.mock('../../../components/mainComponents/Table', () => ({
  default: ({ data, actions }) => (
    <div data-testid="table-component">
      <div>Table with {data?.length || 0} items</div>
      {actions && <div>Has actions</div>}
    </div>
  ),
}));

// Mock the apexcharts
jest.mock('react-apexcharts', () => ({
  default: ({ options, series, type, height }) => (
    <div data-testid="chart-component">
      Chart: {type}, Height: {height}
    </div>
  ),
}));

describe('TelecallerDashboard', () => {
  const mockGet = require('../../../services/apiClient').default.get;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default successful responses
    mockGet.mockImplementation((endpoint) => {
      switch (endpoint) {
        case require('../../../services/apiClient').apiEndpoints.doctors.myDoctors:
          return Promise.resolve({
            data: {
              success: true,
              data: [
                { 
                  _id: '1', 
                  name: 'Dr. John Doe', 
                  hospitalName: 'City Hospital', 
                  mobile: '1234567890',
                  createdAt: new Date().toISOString()
                },
              ],
            },
          });
        case require('../../../services/apiClient').apiEndpoints.alerts.myAlerts:
          return Promise.resolve({
            data: {
              success: true,
              data: [
                { _id: '1', title: 'Follow up', createdAt: new Date().toISOString() },
              ],
            },
          });
        case require('../../../services/apiClient').apiEndpoints.quotations.myQuotations:
          return Promise.resolve({
            data: {
              success: true,
              data: [
                { _id: '1', doctorName: 'Dr. John', status: 'pending' },
              ],
            },
          });
        case require('../../../services/apiClient').apiEndpoints.reports.dashboard:
          return Promise.resolve({
            data: {
              success: true,
              data: {
                callsMadeToday: 10,
                newEnquiries: 5,
                pendingFollowup: 3,
                convertedLeads: 2,
              },
            },
          });
        default:
          return Promise.resolve({ data: { success: true, data: [] } });
      }
    });
  });

  test('renders dashboard and fetches data successfully', async () => {
    render(<Dashboard />);

    // Should show loading initially
    expect(screen.getByText(/loading dashboard/i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading dashboard/i)).not.toBeInTheDocument();
    });

    // Verify API calls were made
    expect(mockGet).toHaveBeenCalledTimes(4);
    expect(mockGet).toHaveBeenCalledWith(require('../../../services/apiClient').apiEndpoints.doctors.myDoctors);
    expect(mockGet).toHaveBeenCalledWith(require('../../../services/apiClient').apiEndpoints.alerts.myAlerts);
    expect(mockGet).toHaveBeenCalledWith(require('../../../services/apiClient').apiEndpoints.quotations.myQuotations);
    expect(mockGet).toHaveBeenCalledWith(require('../../../services/apiClient').apiEndpoints.reports.dashboard);

    // Check that data is displayed
    expect(screen.getByText(/calls made today/i)).toBeInTheDocument();
    expect(screen.getByText(/new enquiries added/i)).toBeInTheDocument();
    expect(screen.getByText(/pending followup/i)).toBeInTheDocument();
    expect(screen.getByText(/converted leads/i)).toBeInTheDocument();
  });
});