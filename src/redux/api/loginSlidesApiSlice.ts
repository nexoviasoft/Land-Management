import { apiSlice } from './apiSlice';

export const loginSlidesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLoginSlides: builder.query<any, void>({
      query: () => '/login-slides',
      providesTags: ['LoginSlide' as any],
    }),
    createLoginSlide: builder.mutation<any, any>({
      query: (data) => ({
        url: '/login-slides',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['LoginSlide' as any],
    }),
    updateLoginSlide: builder.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `/login-slides/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['LoginSlide' as any],
    }),
    deleteLoginSlide: builder.mutation<any, number>({
      query: (id) => ({
        url: `/login-slides/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LoginSlide' as any],
    }),
  }),
});

export const {
  useGetLoginSlidesQuery,
  useCreateLoginSlideMutation,
  useUpdateLoginSlideMutation,
  useDeleteLoginSlideMutation,
} = loginSlidesApiSlice;
