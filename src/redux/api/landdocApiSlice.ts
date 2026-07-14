import { apiSlice } from './apiSlice';

export const landdocApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLanddocs: builder.query<any, any>({
      query: (params) => ({
        url: '/landdoc',
        params,
      }),
      providesTags: ['Landdoc'],
    }),
    getLanddoc: builder.query<any, string>({
      query: (id) => `/landdoc/${id}`,
      providesTags: (result, error, id) => [{ type: 'Landdoc', id }],
    }),
    createLanddoc: builder.mutation<any, any>({
      query: (data) => ({
        url: '/landdoc',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Landdoc'],
    }),
    updateLanddoc: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/landdoc/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Landdoc', id }],
    }),
    deleteLanddoc: builder.mutation<any, string>({
      query: (id) => ({
        url: `/landdoc/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Landdoc'],
    }),
    uploadLanddocFile: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/landdoc/upload',
        method: 'POST',
        body: formData,
      }),
    }),
    approveLanddoc: builder.mutation<any, string>({
      query: (id) => ({
        url: `/landdoc/${id}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Landdoc', id }, 'Landdoc'],
    }),
  }),
});

export const {
  useGetLanddocsQuery,
  useGetLanddocQuery,
  useCreateLanddocMutation,
  useUpdateLanddocMutation,
  useDeleteLanddocMutation,
  useUploadLanddocFileMutation,
  useApproveLanddocMutation,
} = landdocApiSlice;
