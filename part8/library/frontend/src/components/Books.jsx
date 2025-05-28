import { useState } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_GENRES } from '../queries/queries'

import FilteredBookList from './FilteredBookList'

const Books = (props) => {
  const [genre, setGenre] = useState(null)

  const allGenresResult = useQuery(ALL_GENRES)

  if (!props.show) {
    return null
  }

  if(allGenresResult.loading) {
    return null
  }

  const genres = allGenresResult.data.allGenres

  return (
    <div>
      <h2>books</h2>
      {genre && <div>in genre <strong>{genre}</strong></div>}
      <FilteredBookList genre={genre} />
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
