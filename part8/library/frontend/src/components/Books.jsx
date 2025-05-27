import { useQuery } from '@apollo/client'

import { ALL_BOOKS } from '../queries/queries'

const Books = (props) => {
  const allBooksResult = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  if(allBooksResult.loading) {
    return null
  }

  console.log(allBooksResult.data.allBooks)

  const books = allBooksResult.data.allBooks

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
