import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  shopDomain: string;
  accessToken: string;
  name: string;
  email: string;
  password: string;
}

export interface OverviewMetrics {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  avgOrderValue?: number;
  revenueGrowth?: number;
}

export interface Order {
  id: string;
  orderNumber: string | null;
  email: string | null;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  totalPrice: number;
  currency: string | null;
  shopifyCreatedAt: string | null;
  customer: {
    id: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
  } | null;
}

export interface TopCustomer {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  totalSpent: number;
  ordersCount: number;
}

export interface RevenueTrend {
  date: string;
  revenue: number;
}

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/tenant/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  register: async (data: RegisterData) => {
    const response = await api.post('/tenant/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  getMe: async () => {
    return api.get('/tenant/me').then((res) => res.data);
  },
};

export const ingestionAPI = {
  syncAll: () => api.post('/ingestion/sync/all'),
  syncCustomers: () => api.post('/ingestion/sync/customers'),
  syncProducts: () => api.post('/ingestion/sync/products'),
  syncOrders: () => api.post('/ingestion/sync/orders'),
  recordEvent: (eventType: string, data?: any) =>
    api.post('/ingestion/events', { eventType, ...data }),
};

export const analyticsAPI = {
  getOverview: (): Promise<OverviewMetrics> =>
    api.get('/analytics/overview').then((res) => res.data),
  getOrders: (params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }) => api.get('/analytics/orders', { params }).then((res) => res.data),
  getTopCustomers: (limit?: number): Promise<TopCustomer[]> =>
    api.get('/analytics/customers/top', { params: { limit } }).then((res) => res.data),
  getRevenueTrends: (params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
  }): Promise<RevenueTrend[]> =>
    api.get('/analytics/revenue/trends', { params }).then((res) => res.data),
  getOrderStatus: () => api.get('/analytics/orders/status').then((res) => res.data),
  getTopProducts: (limit?: number) =>
    api.get('/analytics/products/top', { params: { limit } }).then((res) => res.data),
  getCustomerTrends: (params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
  }) => api.get('/analytics/customers/trends', { params }).then((res) => res.data),
  getAOVTrends: (params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
  }) => api.get('/analytics/aov/trends', { params }).then((res) => res.data),
  getFunnelMetrics: () => api.get('/analytics/funnel').then((res) => res.data),
};

export default api;

