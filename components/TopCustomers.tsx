'use client';

import { useEffect, useState } from 'react';
import { analyticsAPI } from '@/lib/api';

export default function TopCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const topCustomers = await analyticsAPI.getTopCustomers(5);
      setCustomers(topCustomers);
    } catch (error) {
      console.error('Failed to load top customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Top 5 Customers</h2>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Top 5 Customers by Spend</h2>
      <div className="space-y-4">
        {customers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No customers found</p>
        ) : (
          customers.map((customer, index) => (
            <div key={customer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {customer.firstName || customer.lastName
                      ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
                      : 'Unknown Customer'}
                  </p>
                  <p className="text-sm text-gray-500">{customer.email || 'No email'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatCurrency(customer.totalSpent)}</p>
                <p className="text-sm text-gray-500">{customer.ordersCount} orders</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

