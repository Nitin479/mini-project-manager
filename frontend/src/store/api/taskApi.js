import { apiSlice } from './apiSlice';

export const taskApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: ({ projectId, status, sortBy, order }) => {
        const params = new URLSearchParams();
        if (status && status !== 'All') params.append('status', status);
        if (sortBy) params.append('sortBy', sortBy);
        if (order) params.append('order', order);
        const queryString = params.toString();
        return `/projects/${projectId}/tasks${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Tasks', id: _id })),
              { type: 'Tasks', id: 'LIST' },
            ]
          : [{ type: 'Tasks', id: 'LIST' }],
    }),
    createTask: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/tasks`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Tasks', id: 'LIST' },
        { type: 'Projects', id: 'LIST' },
      ],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Tasks', id },
        { type: 'Tasks', id: 'LIST' },
        { type: 'Projects', id: 'LIST' },
      ],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Tasks', id: 'LIST' },
        { type: 'Projects', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
