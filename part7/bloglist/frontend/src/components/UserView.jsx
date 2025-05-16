import { useParams } from 'react-router-dom'
import { useUserQuery } from '../queries/userQuery'

import { useBlogQuery } from '../queries/blogQuery'

const UserView = () => {
  const id = useParams().id

  const userQuery = useUserQuery()
  const blogQuery = useBlogQuery()

  if(userQuery.isLoading || blogQuery.isLoading) {
    return <div>loading...</div>
  }

  const user = userQuery.data.find(x => x.id === id)

  if(!user) {
    return <div>user not found</div>
  }

  const allBlogs = blogQuery.data
  const submittedBlogs = allBlogs.filter(x => x.user.id === id)

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {submittedBlogs.map((blog) => (
          <li>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserView