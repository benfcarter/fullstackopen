const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

const testBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const blogs = []

    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const blogs = [testBlogs[0]]

    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 7)
  })

  test('of a bigger list is calculated right', () => {
    const blogs = testBlogs

    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })
})

describe('favorite blog', () => {
  test('from empty list is null', () => {
    const blogs = []

    const result = listHelper.favoriteBlog(blogs)
    assert.strictEqual(result, null)
  })

  test('from list of only one blog is that', () => {
    const blogs = [testBlogs[0]]

    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, testBlogs[0])
  })

  test('from a bigger list is calculated right', () => {
    const blogs = testBlogs

    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, testBlogs[2])
  })
})

describe('most blogs', () => {
  test('from empty list is null', () => {
    const blogs = []

    const result = listHelper.mostBlogs(blogs)
    assert.strictEqual(result, null)
  })

  test('from list of only one blog is that blog\'s author', () => {
    const blogs = [testBlogs[0]]

    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: "Michael Chan",
      blogs: 1
    })
  })

  test('from a bigger list is calculated right', () => {
    const blogs = testBlogs

    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3
    })
  })
})

describe('most likes', () => {
  test('from empty list is null', () => {
    const blogs = []

    const result = listHelper.mostLikes(blogs)
    assert.strictEqual(result, null)
  })

  test('from list of only one blog is that blog\'s author', () => {
    const blogs = [testBlogs[0]]

    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: "Michael Chan",
      likes: 7
    })
  })

  test('from a bigger list is calculated right', () => {
    const blogs = testBlogs

    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17
    })
  })
})