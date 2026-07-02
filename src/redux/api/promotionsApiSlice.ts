import { apiSlice } from './apiSlice';

export const promotionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPromotions: builder.query<any, void>({
      query: () => '/promotions',
      providesTags: ['Promotion' as any],
    }),
    getPromotionByCode: builder.query<any, string>({
      query: (code) => `/promotions/code/${code}`,
      providesTags: ['Promotion' as any],
    }),
    createPromotion: builder.mutation<any, any>({
      query: (data) => ({
        url: '/promotions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Promotion' as any],
    }),
    updatePromotion: builder.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `/promotions/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Promotion' as any],
    }),
    deletePromotion: builder.mutation<any, number>({
      query: (id) => ({
        url: `/promotions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Promotion' as any],
    }),
  }),
});

export const {
  useGetPromotionsQuery,
  useGetPromotionByCodeQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
} = promotionsApiSlice;
