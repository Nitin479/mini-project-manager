import { apiSlice } from './apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetMeQuery } = authApi;
