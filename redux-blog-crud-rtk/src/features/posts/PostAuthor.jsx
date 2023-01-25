import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUserById } from "../users/usersSlice";

const PostAuthor = ({userId}) => {
  const author = useSelector(state => selectUserById(state, userId));

  let content;
  if (!author) {
    content = <span>Loading...</span>
  } else {
    content = <span>by {author 
      ? <Link to={`/user/${userId}`}>{author.name}</Link> 
      : 'Unknown author'}</span>
  }

  return content
  
}

export default PostAuthor