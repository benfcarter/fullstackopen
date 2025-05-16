import { Link } from 'react-router-dom'
import { useUserQuery } from '../queries/userQuery'

const UserListView = () => {
  const result = useUserQuery();

  if(result.isLoading)
  {
    return <div>loading...</div>
  }

  const users = result.data

  console.log(users)

  return (
    <div>
      <h2>Users</h2>
      <table>
        <tr>
          <th />
          <th>blogs created</th>
        </tr>
        {users.map((user) => (
          <tr>
            <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
            <td>{user.blogs.length}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}

export default UserListView