import { apiSlice } from './apiSlice';

export const overviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOverview: builder.query({
      query: () => '/overview',
      providesTags: ['Landdoc', 'User'], // Invalidate if docs or users change
    }),
  }),
});

export const {
  useGetOverviewQuery,
} = overviewApiSlice;
