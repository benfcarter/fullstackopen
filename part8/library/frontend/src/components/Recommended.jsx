import { useQuery } from "@apollo/client"

import { FAVORITE_GENRE } from "../queries/queries"

import FilteredBookList from "./FilteredBookList"

const RecommendedList = ({ show }) => {
  const favoriteGenreResult = useQuery(FAVORITE_GENRE)

  if (!show) {
    return null
  }

  if(favoriteGenreResult.isLoading) {
    return <div>loading...</div>
  }

  const genre = favoriteGenreResult.data.me.favoriteGenre

  return (
    <div>
      <h2>books</h2>
      <div>books in your favorite genre <strong>{genre}</strong></div>
      <FilteredBookList genre={genre} />
    </div>
  )
}

export default RecommendedList