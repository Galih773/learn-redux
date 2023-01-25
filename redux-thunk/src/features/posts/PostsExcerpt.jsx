import PostAuthor from './PostAuthor'
import ReactionButtons from './ReactionButtons'
import TimeAgo from './TimeAgo'

const PostsExcerpt = ({post}) => {
  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <p>{post.body.substring(0, 100)}</p>
      <p className='postCredit'>
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date}/>
      </p>
      <ReactionButtons post={post} />
    </article>
  )
}

export default PostsExcerpt