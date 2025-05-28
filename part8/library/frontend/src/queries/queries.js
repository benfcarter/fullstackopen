import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name,
      born,
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query($genre: String) {
    allBooks(genre: $genre) {
      title
      author {
        name
        born
      }
      published
      genres
    }
  }
`

export const ALL_GENRES = gql`
  query {
    allGenres
  }
`

export const FAVORITE_GENRE = gql`
  query {
    me {
      favoriteGenre
    }
  }
`
