import { apiSlice } from './apiSlice';

export const projectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => '/projects',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Projects', id: _id })),
              { type: 'Projects', id: 'LIST' },
            ]
          : [{ type: 'Projects', id: 'LIST' }],
    }),
    getProject: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Projects', id }],
    }),
    createProject: builder.mutation({
      query: (body) => ({
        url: '/projects',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Projects', id: 'LIST' }],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/projects/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Projects', id },
        { type: 'Projects', id: 'LIST' },
      ],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Projects', id: 'LIST' }],
    }),
    seedDemo: builder.mutation({
      query: () => ({
        url: '/projects/seed-demo',
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Projects', id: 'LIST' }, { type: 'Tasks', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useSeedDemoMutation,
} = projectApi;
