import React, { useState } from 'react';
import apiClient, { apiEndpoints } from '../../services/apiClient';

const ApiTest = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, success, data, error = null) => {
    setResults(prev => [...prev, {
      test,
      success,
      data,
      error,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testHealthCheck = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/health');
      addResult('Health Check', true, response.data);
    } catch (error) {
      addResult('Health Check', false, null, error.message);
    } finally {
      setLoading(false);
    }
  };

  const testGetEndpoints = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/');
      addResult('Get Endpoints', true, response.data);
    } catch (error) {
      addResult('Get Endpoints', false, null, error.message);
    } finally {
      setLoading(false);
    }
  };

  const testUserLogin = async () => {
    setLoading(true);
    try {
      // First try to seed admin if not exists
      const seedResponse = await apiClient.post(apiEndpoints.auth.seedAdmin, {});
      addResult('Seed Admin', true, seedResponse.data);

      // Then try to login
      const loginResponse = await apiClient.post(apiEndpoints.auth.login, {
        email: 'admin@rapid.com',
        password: 'Admin@123'
      });
      addResult('Admin Login', true, loginResponse.data);

      // Store token for subsequent requests
      if (loginResponse.data.token) {
        localStorage.setItem('token', loginResponse.data.token);
        localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
      }
    } catch (error) {
      addResult('User Login', false, null, error.message);
    } finally {
      setLoading(false);
    }
  };

  const testGetUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(apiEndpoints.users.list);
      addResult('Get Users List', true, response.data);
    } catch (error) {
      addResult('Get Users List', false, null, error.message);
    } finally {
      setLoading(false);
    }
  };

  const testGetDoctors = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(apiEndpoints.doctors.list);
      addResult('Get Doctors List', true, response.data);
    } catch (error) {
      addResult('Get Doctors List', false, null, error.message);
    } finally {
      setLoading(false);
    }
  };

  const testGetPolicies = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(apiEndpoints.policies.list);
      addResult('Get Policies List', true, response.data);
    } catch (error) {
      addResult('Get Policies List', false, null, error.message);
    } finally {
      setLoading(false);
    }
  };

  const testGetReports = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(apiEndpoints.reports.dashboard);
      addResult('Get Dashboard Report', true, response.data);
    } catch (error) {
      addResult('Get Dashboard Report', false, null, error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  const runAllTests = async () => {
    await testHealthCheck();
    await testGetEndpoints();
    await testUserLogin();
    await testGetUsers();
    await testGetDoctors();
    await testGetPolicies();
    await testGetReports();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">API Integration Test Suite</h2>

      {/* Test Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <button
          onClick={testHealthCheck}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Health Check
        </button>
        <button
          onClick={testGetEndpoints}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Get Endpoints
        </button>
        <button
          onClick={testUserLogin}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Test Login
        </button>
        <button
          onClick={testGetUsers}
          disabled={loading}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
        >
          Get Users
        </button>
        <button
          onClick={testGetDoctors}
          disabled={loading}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
        >
          Get Doctors
        </button>
        <button
          onClick={testGetPolicies}
          disabled={loading}
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 disabled:opacity-50"
        >
          Get Policies
        </button>
        <button
          onClick={testGetReports}
          disabled={loading}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
        >
          Get Reports
        </button>
        <button
          onClick={runAllTests}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          Run All Tests
        </button>
      </div>

      {/* Clear Results */}
      <div className="mb-4">
        <button
          onClick={clearResults}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear Results
        </button>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              result.success
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{result.test}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                result.success
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {result.success ? '✅ PASS' : '❌ FAIL'}
              </span>
            </div>

            <div className="text-sm text-gray-600 mb-2">
              {result.timestamp}
            </div>

            {result.success && result.data && (
              <div className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                <pre>{JSON.stringify(result.data, null, 2)}</pre>
              </div>
            )}

            {result.error && (
              <div className="bg-red-100 p-3 rounded text-sm text-red-800">
                Error: {result.error}
              </div>
            )}
          </div>
        ))}

        {results.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No tests run yet. Click a button above to start testing.
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-center mt-2">Running test...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTest;
