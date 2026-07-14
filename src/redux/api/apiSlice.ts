import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://land-management-api.vercel.app',
  prepareHeaders: (headers, { getState }) => {
    // Inject token if available
    const state = getState() as RootState;
    const token = state.auth?.token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Landdoc', 'User', 'Auth', 'LoginSlide', 'Promotion', 'Notification', 'Notice', 'Trash'],
  endpoints: () => ({}),
});
