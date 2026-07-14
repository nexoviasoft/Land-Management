import { apiSlice } from './apiSlice';

export const overviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOverview: builder.query({
      query: () => '/overview',
      providesTags: ['Landdoc', 'User'], // Invalidate if docs or users change
    }),
    getSuperAdminOverview: builder.query({
      query: () => '/overview/superadmin',
      providesTags: ['Landdoc', 'User'],
    }),
    getUserOverview: builder.query({
      query: (userId: string) => `/overview/user/${userId}`,
      providesTags: ['Landdoc'],
    }),
  }),
});

export const {
  useGetOverviewQuery,
  useGetSuperAdminOverviewQuery,
  useGetUserOverviewQuery,
} = overviewApiSlice;
