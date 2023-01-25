import { useSelector } from 'react-redux'
import { getPostsError, getPostsStatus, selectPostIds} from './postsSlice'
import PostsExcerpt from './PostsExcerpt'

const PostsList = () => {

  const orderedPostIds = useSelector(selectPostIds)
  const postsStatus = useSelector(getPostsStatus)
  const postsError = useSelector(getPostsError)
  
  let content;
  if (postsStatus === 'loading') {
    content = <p>"Loading..."</p>
  } else if (postsStatus === 'succeeded') {
    content = orderedPostIds.map(postId => <PostsExcerpt key={"post"+postId} postId={postId} />)
  } else if (postsStatus === 'failed') {
    content = <p>{postsError}</p>
  }

  return (
    <section>
      {content}
    </section>
  )
}

export default PostsList