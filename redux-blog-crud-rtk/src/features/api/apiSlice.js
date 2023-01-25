import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = 'http://localhost:3500'

export const apiSlice = createApi({
  reducerPath: 'api', // optional
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Posts', 'PostUser'],
  endpoints: builder => ({})
})

export const userApiSlice = createApi({
  reducerPath: 'user', // optional,
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Users'],
  endpoints: builder => ({})
})