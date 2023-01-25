import { userApiSlice } from "../api/apiSlice";

export const extendUsersApiSlice = userApiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/users',
            providesTags: (result, error, arg) => {
              console.log(result)
              return [
                {type: 'Users', id: 'LIST'},
              ]
            }
        })
    })
})

export const selectUsersResult = extendUsersApiSlice.endpoints.getUsers.select();

export const selectAllUsers = state => selectUsersResult(state).data;
export const selectUserById = (state, userId) => selectUsersResult(state).data?.find(user => user.id === userId);
