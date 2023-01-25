import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectAllPosts, getPostsError, getPostsStatus, fetchPosts } from './postsSlice'
import PostsExcerpt from './PostsExcerpt'

const PostsList = () => {
  const dispacth = useDispatch();

  const posts = useSelector(selectAllPosts)
  const postsStatus = useSelector(getPostsStatus)
  const postsError = useSelector(getPostsError)

  useEffect(()=>{
    if (postsStatus === 'idle') {
      dispacth(fetchPosts())
    }
  },[postsStatus, dispacth])
  
  let content;
  if (postsStatus === 'loading') {
    content = <p>"Loading..."</p>
  } else if (postsStatus === 'succeeded') {
    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
    content = orderedPosts.map(post => <PostsExcerpt key={"post"+post.id} post={post} />)
  } else if (postsStatus === 'failed') {
    content = <p>{postsError}</p>
  }

  return (
    <section>
      <h2>Posts</h2>
      {content}
    </section>
  )
}

export default PostsList