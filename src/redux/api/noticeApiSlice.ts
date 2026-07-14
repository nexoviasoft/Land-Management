import { apiSlice } from './apiSlice';

export interface Notice {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
}

export const noticeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActiveNotice: builder.query<{ statusCode: number, message: string, data: Notice | null }, void>({
      query: () => '/notice/active',
      providesTags: ['Notice'] as any,
    }),
    getNotices: builder.query<{ statusCode: number, message: string, data: Notice[] }, void>({
      query: () => '/notice',
      providesTags: ['Notice'] as any,
    }),
    getNoticeById: builder.query<{ statusCode: number, message: string, data: Notice }, string>({
      query: (id) => `/notice/${id}`,
      providesTags: ['Notice'] as any,
    }),
    createNotice: builder.mutation<{ statusCode: number, message: string, data: Notice }, { title: string, content: string }>({
      query: (body) => ({
        url: '/notice',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Notice'] as any,
    }),
  }),
});

export const {
  useGetActiveNoticeQuery,
  useGetNoticesQuery,
  useGetNoticeByIdQuery,
  useCreateNoticeMutation,
} = noticeApiSlice;
