import { useBlogQuery } from "../queries/blogQuery"
import { useUserValue } from "../contexts/UserContext"

import Blog from "./Blog"

const BlogList = () => {
  const result = useBlogQuery()
  const blogs = result.data

  const user = useUserValue()

  return (
    <div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          userId={user.id}
        />
      ))}
    </div>
  )
}

export default BlogList