import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import CreateBulkReceipt from '../CreateBulkReceipt';
import apiClient from '../../../services/apiClient';

// Mock the apiClient
jest.mock('../../../services/apiClient');

// Mock XLSX library
jest.mock('xlsx', () => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn(() => [
      ['Unique_Registration_Number', 'Transaction ID', 'Presentment Mode', 'Customer Name', 'Amount', 'Date', 'Status', 'Reason Code', 'Reason description'],
      ['RML-10830/May 2025', '702250332699', 'NACH - ACH - DR', 'Nilesh Namdeo Nalavade', '1250', '07-10-2025 00:00:00', 'Bill Payment Successful', '00', ''],
      ['RML-10831/May 2025', '702250332700', 'NACH - ACH - DR', 'Pragati Hospital', '1250', '07-10-2025 00:00:00', 'Bill Payment Successful', '00', ''],
    ])
  }
}));

// Mock FileReader
global.FileReader = class MockFileReader {
  onload = null;
  readAsBinaryString = jest.fn(() => {
    if (this.onload) {
      this.onload({ target: { result: 'mock-binary-data' } });
    }
  });
};

// Mock the XLSX.read function
const mockRead = jest.requireActual('xlsx').read;
jest.mock('xlsx', () => ({
  ...jest.requireActual('xlsx'),
  read: jest.fn(() => ({
    SheetNames: ['Sheet1'],
    Sheets: { Sheet1: {} }
  })),
  utils: {
    ...jest.requireActual('xlsx').utils,
    sheet_to_json: jest.fn(() => [
      ['Unique_Registration_Number', 'Transaction ID', 'Presentment Mode', 'Customer Name', 'Amount', 'Date', 'Status', 'Reason Code', 'Reason description'],
      ['RML-10830/May 2025', '702250332699', 'NACH - ACH - DR', 'Nilesh Namdeo Nalavade', '1250', '07-10-2025 00:00:00', 'Bill Payment Successful', '00', ''],
      ['RML-10831/May 2025', '702250332700', 'NACH - ACH - DR', 'Pragati Hospital', '1250', '07-10-2025 00:00:00', 'Bill Payment Successful', '00', ''],
    ])
  }
}));

describe('CreateBulkReceipt Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset XLSX mock implementations
    require('xlsx').read.mockImplementation(mockRead);
    require('xlsx').utils.sheet_to_json.mockImplementation(() => [
      ['Unique_Registration_Number', 'Transaction ID', 'Presentment Mode', 'Customer Name', 'Amount', 'Date', 'Status', 'Reason Code', 'Reason description'],
      ['RML-10830/May 2025', '702250332699', 'NACH - ACH - DR', 'Nilesh Namdeo Nalavade', '1250', '07-10-2025 00:00:00', 'Bill Payment Successful', '00', ''],
      ['RML-10831/May 2025', '702250332700', 'NACH - ACH - DR', 'Pragati Hospital', '1250', '07-10-2025 00:00:00', 'Bill Payment Successful', '00', ''],
    ]);

    // Mock alert function
    window.alert = jest.fn();
  });

  test('renders source selection step initially', () => {
    render(
      <MemoryRouter>
        <CreateBulkReceipt />
      </MemoryRouter>
    );

    expect(screen.getByText('Select Receipt Source')).toBeInTheDocument();
    expect(screen.getByText('Import from Excel/CSV')).toBeInTheDocument();
    expect(screen.getByText('Create from Sales Bills')).toBeInTheDocument();
  });

  test('switches to file import step when Excel option is selected', () => {
    render(
      <MemoryRouter>
        <CreateBulkReceipt />
      </MemoryRouter>
    );

    // Click on 'Import from Excel/CSV' option
    fireEvent.click(screen.getByText('Import from Excel/CSV'));

    // Click the continue button
    const continueButton = screen.getByText('Continue');
    fireEvent.click(continueButton);

    // Expect the file import step to be visible
    expect(screen.getByText('(1) Import File')).toBeInTheDocument();
  });

  test('switches to bill selection step when Sales Bills option is selected', async () => {
    // Mock the API call for fetching sales bills
    apiClient.get.mockResolvedValue({
      data: {
        success: true,
        data: [],
        pagination: { pages: 1 }
      }
    });

    render(
      <MemoryRouter>
        <CreateBulkReceipt />
      </MemoryRouter>
    );

    // Click on 'Create from Sales Bills' option
    fireEvent.click(screen.getByText('Create from Sales Bills'));

    // Click the continue button
    const continueButton = screen.getByText('Continue');
    fireEvent.click(continueButton);

    // Wait for the API call to complete
    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/sales-bills', {
        params: {
          page: 1,
          limit: 10,
          search: '',
          status: ''
        }
      });
    });

    // Expect the bill selection step to be visible
    expect(screen.getByText('(1) Select Sales Bills')).toBeInTheDocument();
  });

  test('handles file upload correctly', async () => {
    render(
      <MemoryRouter>
        <CreateBulkReceipt />
      </MemoryRouter>
    );

    // Click on 'Import from Excel/CSV' option
    fireEvent.click(screen.getByText('Import from Excel/CSV'));

    // Click the continue button
    fireEvent.click(screen.getByText('Continue'));

    // Create a mock file
    const file = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Find the file input and fire the change event
    const fileInput = screen.getByLabelText('Choose File');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // The file name should appear in the UI
    expect(screen.getByText('test.xlsx')).toBeInTheDocument();
  });

  test('handles demo data loading', async () => {
    render(
      <MemoryRouter>
        <CreateBulkReceipt />
      </MemoryRouter>
    );

    // Click on 'Import from Excel/CSV' option
    fireEvent.click(screen.getByText('Import from Excel/CSV'));

    // Click the continue button
    fireEvent.click(screen.getByText('Continue'));

    // Click the 'Load Demo Data' button
    const loadDemoButton = screen.getByText('Load Demo Data');
    fireEvent.click(loadDemoButton);

    // Expect to move to mapping step
    await waitFor(() => {
      expect(screen.getByText('(2) Map Columns')).toBeInTheDocument();
    });
  });

  test('maps Excel columns to receipt fields correctly and navigates to preview', async () => {
    render(
      <MemoryRouter>
        <CreateBulkReceipt />
      </MemoryRouter>
    );

    // Navigate to mapping step with demo data
    fireEvent.click(screen.getByText('Import from Excel/CSV'));
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.click(screen.getByText('Load Demo Data'));

    // Wait for the mapping step to appear
    await waitFor(() => {
      expect(screen.getByText('(2) Map Columns')).toBeInTheDocument();
    });

    // Select required columns for mapping
    const selectElements = screen.getAllByRole('combobox');

    // Map Doctor to Customer Name
    fireEvent.change(selectElements[0], { target: { value: 'Customer Name' } });

    // Map Description to Unique Registration Number
    fireEvent.change(selectElements[2], { target: { value: 'Unique_Registration_Number' } });

    // Map Amount to Amount
    fireEvent.change(selectElements[3], { target: { value: 'Amount' } });

    // Map Date to Date
    fireEvent.change(selectElements[4], { target: { value: 'Date' } });

    // Click 'Apply Mapping' button
    fireEvent.click(screen.getByText('Apply Mapping'));

    // Wait for preview step
    await waitFor(() => {
      expect(screen.getByText('Preview Receipts')).toBeInTheDocument();
    });
  });

  test('selects sales bills and creates receipts', async () => {
    // Mock the API response for sales bills
    const mockSalesBills = [
      {
        _id: '1',
        billNumber: 'SB001',
        client: { name: 'Test Client', type: 'doctor', entityId: 'entity1' },
        totalAmount: 1000,
        outstandingAmount: 1000,
        status: 'pending',
        dueDate: '2023-12-31'
      },
      {
        _id: '2',
        billNumber: 'SB002',
        client: { name: 'Another Client', type: 'hospital', entityId: 'entity2' },
        totalAmount: 2000,
        outstandingAmount: 500,
        status: 'partially_paid',
        dueDate: '2023-11-30'
      }
    ];

    apiClient.get.mockResolvedValue({
      data: {
        success: true,
        data: mockSalesBills,
        pagination: { pages: 1, total: 2 }
      }
    });

    render(
      <MemoryRouter>
        <CreateBulkReceipt />
      </MemoryRouter>
    );

    // Navigate to bill selection
    fireEvent.click(screen.getByText('Create from Sales Bills'));
    fireEvent.click(screen.getByText('Continue'));

    // Wait for bills to load
    await waitFor(() => {
      expect(screen.getByText('SB001')).toBeInTheDocument();
    });

    // Select the first bill
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // Skip the "select all" checkbox

    // Click 'Create Receipts for X Bills' button
    fireEvent.click(screen.getByText('Create Receipts for 1 Bills'));

    // Wait for preview step
    await waitFor(() => {
      expect(screen.getByText('Preview Receipts')).toBeInTheDocument();
    });

    // Verify the preview contains the selected bill data
    expect(screen.getByText('Test Client')).toBeInTheDocument();
  });

  test('handles bulk receipt creation API call successfully', async () => {
    // Mock the API response for creating receipts
    apiClient.post.mockResolvedValue({ data: { success: true, data: { _id: 'receipt-123' } } });

    render(
      <MemoryRouter>
        <CreateBulkReceipt />
      </MemoryRouter>
    );

    // Navigate to the confirmation step by simulating the full process
    fireEvent.click(screen.getByText('Import from Excel/CSV'));
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.click(screen.getByText('Load Demo Data'));

    // Wait for mapping step and complete mapping
    await waitFor(() => {
      expect(screen.getByText('(2) Map Columns')).toBeInTheDocument();
    });

    // Complete the mapping
    const selectElements = screen.getAllByRole('combobox');
    fireEvent.change(selectElements[0], { target: { value: 'Customer Name' } });
    fireEvent.change(selectElements[2], { target: { value: 'Unique_Registration_Number' } });
    fireEvent.change(selectElements[3], { target: { value: 'Amount' } });
    fireEvent.change(selectElements[4], { target: { value: 'Date' } });

    fireEvent.click(screen.getByText('Apply Mapping'));

    // Wait for preview
    await waitFor(() => {
      expect(screen.getByText('Preview Receipts')).toBeInTheDocument();
    });

    // Click to create receipts
    fireEvent.click(screen.getByText('Create 2 Receipts'));

    // Wait for success confirmation
    await waitFor(() => {
      expect(screen.getByText('Receipts Processing Complete!')).toBeInTheDocument();
    });

    // Verify the success message
    expect(screen.getByText('Successfully created 2 receipts!')).toBeInTheDocument();
  });

  test('handles bulk receipt creation with some failures', async () => {
    // Mock the API response to simulate partial failures
    apiClient.post.mockImplementation(() => Promise.reject(new Error('API Error')));

    render(
      <MemoryRouter>
        <CreateBulkReceipt />
      </MemoryRouter>
    );

    // Navigate to the confirmation step by simulating the full process
    fireEvent.click(screen.getByText('Import from Excel/CSV'));
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.click(screen.getByText('Load Demo Data'));

    // Wait for mapping step and complete mapping
    await waitFor(() => {
      expect(screen.getByText('(2) Map Columns')).toBeInTheDocument();
    });

    // Complete the mapping
    const selectElements = screen.getAllByRole('combobox');
    fireEvent.change(selectElements[0], { target: { value: 'Customer Name' } });
    fireEvent.change(selectElements[2], { target: { value: 'Unique_Registration_Number' } });
    fireEvent.change(selectElements[3], { target: { value: 'Amount' } });
    fireEvent.change(selectElements[4], { target: { value: 'Date' } });

    fireEvent.click(screen.getByText('Apply Mapping'));

    // Wait for preview
    await waitFor(() => {
      expect(screen.getByText('Preview Receipts')).toBeInTheDocument();
    });

    // Click to create receipts
    fireEvent.click(screen.getByText('Create 2 Receipts'));

    // Wait for error confirmation
    await waitFor(() => {
      expect(screen.getByText('Receipts Processing Complete!')).toBeInTheDocument();
    });

    // Verify the error message
    expect(screen.getByText(/Created 0 receipts. 2 failed./i)).toBeInTheDocument();
  });

  test('shows error when required fields are not mapped', async () => {
    render(
      <MemoryRouter>
        <CreateBulkReceipt />
      </MemoryRouter>
    );

    // Navigate to mapping step with demo data
    fireEvent.click(screen.getByText('Import from Excel/CSV'));
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.click(screen.getByText('Load Demo Data'));

    // Wait for the mapping step to appear
    await waitFor(() => {
      expect(screen.getByText('(2) Map Columns')).toBeInTheDocument();
    });

    // Don't map required fields, just click 'Apply Mapping'
    fireEvent.click(screen.getByText('Apply Mapping'));

    // Check if alert was called with the correct message
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Please map: Doctor, Amount, Date');
    });
  });

  test('resets process correctly', async () => {
    render(
      <MemoryRouter>
        <CreateBulkReceipt />
      </MemoryRouter>
    );

    // Navigate to second step
    fireEvent.click(screen.getByText('Import from Excel/CSV'));
    fireEvent.click(screen.getByText('Continue'));

    // Expect to be on step 2
    expect(screen.getByText('(1) Import File')).toBeInTheDocument();

    // Click back to go to step 1
    fireEvent.click(screen.getByText('Back'));

    // Should be back on source selection
    expect(screen.getByText('Select Receipt Source')).toBeInTheDocument();
  });

  test('navigates back and forth between steps correctly', async () => {
    render(
      <MemoryRouter>
        <CreateBulkReceipt />
      </MemoryRouter>
    );

    // Go to file import
    fireEvent.click(screen.getByText('Import from Excel/CSV'));
    fireEvent.click(screen.getByText('Continue'));

    // Load demo data to go to mapping
    fireEvent.click(screen.getByText('Load Demo Data'));

    // Wait for mapping step
    await waitFor(() => {
      expect(screen.getByText('(2) Map Columns')).toBeInTheDocument();
    });

    // Click back to file import
    fireEvent.click(screen.getByText('Back'));

    // Should be back on file import
    expect(screen.getByText('(1) Import File')).toBeInTheDocument();
  });

  test('applies search and filter on sales bills', async () => {
    apiClient.get.mockResolvedValue({
      data: {
        success: true,
        data: [],
        pagination: { pages: 1 }
      }
    });

    render(
      <MemoryRouter>
        <CreateBulkReceipt />
      </MemoryRouter>
    );

    // Navigate to sales bills
    fireEvent.click(screen.getByText('Create from Sales Bills'));
    fireEvent.click(screen.getByText('Continue'));

    // Wait for bills to load initially
    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/sales-bills', {
        params: {
          page: 1,
          limit: 10,
          search: '',
          status: ''
        }
      });
    });

    // Apply search
    const searchInput = screen.getByPlaceholderText('Bill number, client name...');
    fireEvent.change(searchInput, { target: { value: 'SB001' } });

    // Apply status filter
    const statusSelect = screen.getByRole('combobox', { name: /Status/i });
    fireEvent.change(statusSelect, { target: { value: 'pending' } });

    // Wait for the API call with new params
    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/sales-bills', {
        params: {
          page: 1,
          limit: 10,
          search: 'SB001',
          status: 'pending'
        }
      });
    });
  });

  test('handles pagination controls for sales bills', async () => {
    apiClient.get.mockResolvedValue({
      data: {
        success: true,
        data: [],
        pagination: { pages: 3, total: 25 }
      }
    });

    render(
      <MemoryRouter>
        <CreateBulkReceipt />
      </MemoryRouter>
    );

    // Navigate to sales bills
    fireEvent.click(screen.getByText('Create from Sales Bills'));
    fireEvent.click(screen.getByText('Continue'));

    // Wait for bills to load
    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/sales-bills', {
        params: {
          page: 1,
          limit: 10,
          search: '',
          status: ''
        }
      });
    });

    // Click next page
    fireEvent.click(screen.getByText('Next'));

    // Wait for the API call with new page
    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/sales-bills', {
        params: {
          page: 2,
          limit: 10,
          search: '',
          status: ''
        }
      });
    });

    // Click previous page
    fireEvent.click(screen.getByText('Previous'));

    // Wait for the API call with previous page
    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/sales-bills', {
        params: {
          page: 1,
          limit: 10,
          search: '',
          status: ''
        }
      });
    });
  });
});