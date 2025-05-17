import { useBlogQuery } from "../queries/blogQuery"

const CommentList = ({ id }) => {
  const blogQuery = useBlogQuery()

  if(blogQuery.isLoading) {
    return null
  }

  const blog = blogQuery.data.find(x => x.id === id)
  const comments = blog.comments

  return (
    <div>
      <h3>comments</h3>
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>
            {comment}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CommentList