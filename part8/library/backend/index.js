require('dotenv').config()

const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')

const mongoose = require('mongoose')
const Book = require('./models/Book')
const Author = require('./models/Author')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(async () => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      born: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const query = {}

      if(args.author) {
        const authorEntry = await Author.findOne({ name: args.author })
        query.author = authorEntry._id
      }

      if(args.genre) {
        query.genres = args.genre
      }

      return Book.find(query).populate('author')
    },
    allAuthors: async () => {
      const authorList = await Author.find({})
      return authorList.map(a => ({
        name: a.name,
        born: a.born,
        bookCount: a.books.length
      }))
    }
  },
  Mutation: {
    addBook: (root, args) => {
      const book = { ...args, id: uuid() }
      books = books.concat(book)

      if(!authors.find(x => x.name === book.author)) {
        const author = {
          name: book.author,
          id: uuid()
        }

        authors = authors.concat(author)
      }

      return book
    },
    editAuthor: (root, args) => {
      authors = authors.map(author => {
        if(author.name !== args.name)
          return author

        return { ...author, born: args.born }
      })

      return authors.find(author => author.name === args.name)
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: process.env.PORT },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})