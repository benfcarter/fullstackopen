import BlogList from "./BlogList"
import CreateBlogForm from "./CreateBlogForm"

const BlogListView = () => {
  return (
    <div>
      <CreateBlogForm />
      <BlogList />
    </div>
  )
}

export default BlogListView