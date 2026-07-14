import { apiSlice } from "./apiSlice";

export const trashApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDeletedUsers: builder.query({
      query: () => "/trash/users",
      providesTags: ["Trash"],
    }),
    getDeletedNotices: builder.query({
      query: () => "/trash/notices",
      providesTags: ["Trash"],
    }),
    getDeletedLandDocs: builder.query({
      query: () => "/trash/landdocs",
      providesTags: ["Trash"],
    }),
    recoverUser: builder.mutation({
      query: (id) => ({
        url: `/trash/users/${id}/recover`,
        method: "POST",
      }),
      invalidatesTags: ["Trash", "Users"],
    }),
    recoverNotice: builder.mutation({
      query: (id) => ({
        url: `/trash/notices/${id}/recover`,
        method: "POST",
      }),
      invalidatesTags: ["Trash", "Notices"],
    }),
    recoverLandDoc: builder.mutation({
      query: (id) => ({
        url: `/trash/landdocs/${id}/recover`,
        method: "POST",
      }),
      invalidatesTags: ["Trash", "LandDocuments"],
    }),
  }),
});

export const {
  useGetDeletedUsersQuery,
  useGetDeletedNoticesQuery,
  useGetDeletedLandDocsQuery,
  useRecoverUserMutation,
  useRecoverNoticeMutation,
  useRecoverLandDocMutation,
} = trashApiSlice;
