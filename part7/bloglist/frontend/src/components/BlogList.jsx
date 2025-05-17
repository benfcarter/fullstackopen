import { Link } from "react-router-dom"
import { useBlogQuery } from "../queries/blogQuery"

const BlogList = () => {
  const blogQuery = useBlogQuery()
  const blogs = blogQuery.data

  return (
    <div>
      {blogs.map((blog) => (
        <p key={blog.id}>
          <Link data-testid="blogEntry" to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </p>
      ))}
    </div>
  )
}

export default BlogList