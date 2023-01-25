import { 
  createSelector,
  createEntityAdapter 
} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "../api/apiSlice";

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState()

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPosts: builder.query({
            query: () => '/posts',
            transformResponse: responseData => {
                let min = 1;
                const loadedPosts = responseData.map(post => {
                    if(!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString()
                    if(!post?.reactions) post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post
                });
                // console.log(loadedPosts)
                // console.log(initialState)
                // console.log(postsAdapter.setAll(initialState, loadedPosts))
                return postsAdapter.setAll(initialState, loadedPosts)
            },
            providesTags: (result, error, arg) => [
            {type: 'Posts', id: 'LIST'},
            ...result.ids.map(id => ({type: 'Posts', id}))
            ]
        }),
        getPostsByUserId: builder.query({
            query: id => `/posts?userId=${id}`,
            transformResponse: responseData => {
                let min = 1;
                const loadedPosts = responseData.map(post => {
                    if(!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString()
                    if(!post?.reactions) post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post
                });
                return postsAdapter.setAll(initialState, loadedPosts)
            },
            providesTags: (result, error, arg) => {
                console.log(result)
                return [
                    {type: 'PostUser', id: arg},
                    ...result.ids.map(id => ({type: 'Post', id }))
                ]
            }
        }),
        addNewPost: builder.mutation({
            query: initialPost => ({
                url: '/posts',
                method: 'POST',
                body: {
                    ...initialPost,
                    userId: Number(initialPost.userId),
                    date: new Date().toISOString(),
                    reactions: {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                }
            }),
            invalidatesTags: (result, error, arg) => [{type: 'Posts', id: 'LIST'}, {type: 'PostUser', id: arg.userId}]
        }),
        updatePost: builder.mutation({
            query: updatedPost => ({
                url: `/posts/${updatedPost.id}`,
                method: 'PUT',
                body: {
                    ...updatedPost,
                    date: new Date().toISOString()
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Posts', id: arg.id }
            ]
        }),
        deletePost: builder.mutation({
            query: ({id}) => ({
                url: `/posts/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Posts', id: arg.id}
            ]
        }),
        addReaction: builder.mutation({
            query: ({ postId, reactions }) => ({
                url: `/posts/${postId}`,
                method: 'PATCH',
                // In a real app, we'd probably use to base this on user ID somehow
                // so that a user can't do same reaction more than once
                body: { reactions }
            }),
            async onQueryStarted({ postId, reactions }, { dispatch, queryFulfilled }) {
                // Optimistically update to the new value in the cache
                // `updateQueryData` is requires the endpoint name and chache key arguments,
                // so it knows which piece of cache to update
                const patchResult = dispatch(
                    extendedApiSlice.util.updateQueryData('getPosts', undefined, draft => {
                        // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
                        const post = draft.entities[postId]
                        if (post) post.reactions = reactions
                    })
                )
                try {
                    // Wait for the actual request to finish
                    await queryFulfilled
                } catch {
                    // If the request failed, use the result from the optimistic update
                    // to roll back the cache
                    patchResult.undo()
                }
            }
        })
    })

})

export const {
    useGetPostsQuery,
    useGetPostsByUserIdQuery,
    useAddNewPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useAddReactionMutation
} = extendedApiSlice

// returns the query result object
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

// Creates memoized selector
const selectPostData = createSelector(
  selectPostsResult,
  postsResult => {
    console.log(postsResult)
    return postsResult.data
  } // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => {
        // console.log(selectPostData(state))
        return selectPostData(state) ?? initialState
    })

