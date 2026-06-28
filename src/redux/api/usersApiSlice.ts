import { apiSlice } from './apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<any, any>({
      query: (params) => ({
        url: '/users',
        params,
      }),
      providesTags: ['User'],
    }),
    getUser: builder.query<any, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    createUser: builder.mutation<any, any>({
      query: (data) => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    banUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/users/${id}/ban`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    unbanUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/users/${id}/unban`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    uploadUserProfilePicture: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/users/upload-picture',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useBanUserMutation,
  useUnbanUserMutation,
  useUploadUserProfilePictureMutation,
} = usersApiSlice;
