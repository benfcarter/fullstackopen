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
  Author: {
    name: (root, args) => root.name,
    born: (root, args) => root.born,
    bookCount: async (root, args) => await Author.findOne({ name: root.name }).then(author => author.books.length)
  },
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
    allAuthors: async () => await Author.find({})
  },
  Mutation: {
    addBook: async (root, args) => {
      const author = await Author.findOne({ name: args.author })

      if(!author) {
        console.log("Author not found")
        return
      }

      const newBook = new Book({
        ...args,
        author: author._id
      })

      const savedBook = await newBook.save()

      console.log(author)
      author.books = author.books.concat(savedBook._id)
      await author.save()

      return savedBook
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })

      if(!author) {
        return
      }

      author.born = args.born
      await author.save()

      return author
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