import { apiSlice } from './apiSlice';

export interface Notification {
  id: string;
  recipientId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<{ statusCode: number, message: string, data: Notification[] }, void>({
      query: () => '/notifications',
      providesTags: ['Notification'] as any,
    }),
    markAsRead: builder.mutation<{ statusCode: number, message: string, data: Notification }, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'] as any,
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
} = notificationsApiSlice;
