const { test, describe } = require("node:test");
const assert = require("node:assert");
const helper = require("./test_helper");

const listHelper = require("../utils/list_helper");

describe("total likes", () => {
  test("of empty list is zero", () => {
    const blogs = [];

    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 0);
  });

  test("when list has only one blog equals the likes of that", () => {
    const blogs = [helper.testBlogs[0]];

    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 7);
  });

  test("of a bigger list is calculated right", () => {
    const blogs = helper.testBlogs;

    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 36);
  });
});

describe("favorite blog", () => {
  test("from empty list is null", () => {
    const blogs = [];

    const result = listHelper.favoriteBlog(blogs);
    assert.strictEqual(result, null);
  });

  test("from list of only one blog is that", () => {
    const blogs = [helper.testBlogs[0]];

    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, helper.testBlogs[0]);
  });

  test("from a bigger list is calculated right", () => {
    const blogs = helper.testBlogs;

    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, helper.testBlogs[2]);
  });
});

describe("most blogs", () => {
  test("from empty list is null", () => {
    const blogs = [];

    const result = listHelper.mostBlogs(blogs);
    assert.strictEqual(result, null);
  });

  test("from list of only one blog is that blog's author", () => {
    const blogs = [helper.testBlogs[0]];

    const result = listHelper.mostBlogs(blogs);
    assert.deepStrictEqual(result, {
      author: "Michael Chan",
      blogs: 1,
    });
  });

  test("from a bigger list is calculated right", () => {
    const blogs = helper.testBlogs;

    const result = listHelper.mostBlogs(blogs);
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});

describe("most likes", () => {
  test("from empty list is null", () => {
    const blogs = [];

    const result = listHelper.mostLikes(blogs);
    assert.strictEqual(result, null);
  });

  test("from list of only one blog is that blog's author", () => {
    const blogs = [helper.testBlogs[0]];

    const result = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(result, {
      author: "Michael Chan",
      likes: 7,
    });
  });

  test("from a bigger list is calculated right", () => {
    const blogs = helper.testBlogs;

    const result = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
