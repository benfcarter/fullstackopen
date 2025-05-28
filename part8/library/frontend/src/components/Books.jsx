import { useState } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_BOOKS, ALL_GENRES } from '../queries/queries'

const Books = (props) => {
  const [genre, setGenre] = useState(null)

  const allBooksResult = useQuery(ALL_BOOKS, {
    variables: { genre }
  })

  const allGenresResult = useQuery(ALL_GENRES)

  if (!props.show) {
    return null
  }

  if(allBooksResult.loading || allGenresResult.loading) {
    return null
  }

  const books = allBooksResult.data.allBooks
  const genres = allGenresResult.data.allGenres

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
      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => setGenre(g)}>{g}</button>
        ))}
      </div>
      <div><button onClick={() => setGenre(null)}>all genres</button></div>
    </div>
  )
}

export default Books
