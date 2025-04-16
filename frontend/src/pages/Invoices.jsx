import React, { useState, useEffect } from 'react';
import api from '../axios-config';

function Invoices() {
  const [activeTab, setActiveTab] = useState('outstanding');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const endpoint = activeTab === 'outstanding' ? '/api/patient/invoices/outstanding/' : '/api/patient/invoices/paid/';
        const response = await api.get(endpoint);
        console.log('Invoices Response:', response.data);
        setInvoices(Array.isArray(response.data) ? response.data : response.data.results || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching invoices:', err);
        setError('Failed to load invoices');
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [activeTab]);

  const handleViewPdf = async (invoiceId) => {
    try {
      const response = await api.get(`/api/patient/invoices/${invoiceId}/download/`, {
        responseType: 'blob'
      });
  
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      
      // Open preview in a new tab
      window.open(fileURL, '_blank');
    } catch (error) {
      console.error('Failed to open PDF:', error);
      setError('Failed to open PDF. Please try again.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Invoices</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('outstanding')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'outstanding'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Outstanding
            </button>
            <button
              onClick={() => setActiveTab('paid')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'paid'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Paid
            </button>
          </nav>
        </div>
        
        <div className="p-6 text-black">
          {loading ? (
            <div className="text-center py-4 text-gray-500">Loading invoices...</div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
              {error}
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              {activeTab === 'outstanding'
                ? 'No outstanding invoices'
                : 'No paid invoices'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    {activeTab === 'paid' && (
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paid Date
                      </th>
                    )}
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(invoice.invoice_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{invoice.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${invoice.amount}</td>
                      {activeTab === 'paid' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          {invoice.paid_date && new Date(invoice.paid_date).toLocaleDateString()}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewPdf(invoice.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Invoices;