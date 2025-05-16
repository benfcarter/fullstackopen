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
            <td>{user.name}</td>
            <td>{user.blogs.length}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}

export default UserListView