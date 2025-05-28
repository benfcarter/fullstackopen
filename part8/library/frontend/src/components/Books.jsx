import { useState } from 'react'
import { useQuery, useApolloClient } from '@apollo/client'

import { ALL_BOOKS, ALL_GENRES } from '../queries/queries'

import FilteredBookList from './FilteredBookList'

const Books = (props) => {
  const [genre, setGenre] = useState(null)

  const client = useApolloClient()
  const allGenresResult = useQuery(ALL_GENRES)

  if (!props.show) {
    return null
  }

  if(allGenresResult.loading) {
    return null
  }

  const handleGenreSelected = (genre) => ((event) => {
    event.preventDefault()
    setGenre(genre)
    client.refetchQueries({
      include: [ALL_GENRES, ALL_BOOKS]
    })
  })

  const genres = allGenresResult.data.allGenres

  return (
    <div>
      <h2>books</h2>
      {genre && <div>in genre <strong>{genre}</strong></div>}
      <FilteredBookList genre={genre} />
      <div>
        {genres.map((g) => (
          <button key={g} onClick={handleGenreSelected(g)}>{g}</button>
        ))}
      </div>
      <div><button onClick={handleGenreSelected(null)}>all genres</button></div>
    </div>
  )
}

export default Books
