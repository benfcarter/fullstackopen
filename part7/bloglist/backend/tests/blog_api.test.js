const { test, after, beforeEach, describe } = require("node:test");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const supertest = require("supertest");
const assert = require("node:assert");
const helper = require("./test_helper");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

describe("when there are some blogs saved already", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("sekret", salt);
    const user = new User({
      username: "root",
      passwordHash: passwordHash,
      name: "Bob",
    });

    await user.save();

    await Blog.deleteMany({});

    const blogObjects = helper.testBlogs.map(
      (blog) => new Blog({ ...blog, user: user.id }),
    );
    const promiseArray = blogObjects.map((blogObject) => blogObject.save());
    await Promise.all(promiseArray);
  });

  describe("general blog structure and behavior", () => {
    test("blogs are returned as json", async () => {
      await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("there are the correct number of blogs", async () => {
      const response = await api.get("/api/blogs");
      assert.strictEqual(response.body.length, helper.testBlogs.length);
    });

    test("blog entries do not have _id", async () => {
      const response = await api.get("/api/blogs");
      const blog = response.body[0];
      assert(!Object.prototype.hasOwnProperty.call(blog, "_id"));
    });

    test("blog entries have id", async () => {
      const response = await api.get("/api/blogs");
      const blog = response.body[0];
      assert(Object.prototype.hasOwnProperty.call(blog, "id"));
    });
  });

  describe("adding a new blog", () => {
    test("a valid blog can be added", async () => {
      const newBlog = {
        title: "Test blog",
        author: "Ben Carter",
        url: "https://google.com",
        likes: 200,
      };

      const token = await helper.getAuthToken(api);

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/blogs");
      const titles = response.body.map((blog) => blog.title);

      assert.strictEqual(titles.length, helper.testBlogs.length + 1);
      assert(titles.includes(newBlog.title));
    });

    test("fails if no token provided", async () => {
      const newBlog = {
        title: "Test blog",
        author: "Ben Carter",
        url: "https://google.com",
        likes: 200,
      };

      await api.post("/api/blogs").send(newBlog).expect(401);
    });

    test("likes defaults to zero if unspecified", async () => {
      const newBlog = {
        title: "No one should like this blog",
        author: "Ben Carter",
        url: "https://google.com",
      };

      const token = await helper.getAuthToken(api);

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/blogs");
      const addedBlog = response.body.find(
        (blog) => blog.title === "No one should like this blog",
      );

      assert.strictEqual(addedBlog.likes, 0);
    });

    test("missing title results in bad request error", async () => {
      const newBlog = {
        author: "Ben Carter",
        url: "https://google.com",
        likes: 100,
      };

      const token = await helper.getAuthToken(api);

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400);
    });

    test("missing url results in bad request error", async () => {
      const newBlog = {
        title: "This blog doesn't exist",
        author: "Ben Carter",
        likes: 100,
      };

      const token = await helper.getAuthToken(api);

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400);
    });

    test("new blogs contian creator info", async () => {
      const users = await api.get("/api/users");
      const user = users.body[0];
      const userId = user.id;

      const newBlog = {
        title: "Test blog",
        author: "Ben Carter",
        url: "https://google.com",
        likes: 200,
        userId: userId,
      };

      const token = await helper.getAuthToken(api);

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201);

      const blogsAfter = await api.get("/api/blogs");
      const blogAfter = blogsAfter.body.find(
        (blog) => blog.title === "Test blog",
      );
      assert.deepStrictEqual(blogAfter.user, {
        username: user.username,
        name: user.name,
        id: user.id,
      });

      const usersAfter = await api.get("/api/users");
      const userAfter = usersAfter.body[0];
      assert.deepStrictEqual(userAfter.blogs, [
        {
          title: newBlog.title,
          author: newBlog.author,
          url: newBlog.url,
          likes: newBlog.likes,
          id: blogAfter.id,
        },
      ]);
    });
  });

  describe("deleting a blog post", () => {
    test("existing post is deleted properly", async () => {
      const response = await api.get("/api/blogs");
      const id = response.body[0].id;

      const token = await helper.getAuthToken(api);

      await api
        .delete(`/api/blogs/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const responseAfterDelete = await api.get("/api/blogs");

      assert.strictEqual(
        responseAfterDelete.body.length,
        helper.testBlogs.length - 1,
      );
      assert(!responseAfterDelete.body.find((blog) => blog.id === id));
    });
  });

  describe("updating a blog post", () => {
    test("post is changed appropriately with valid data", async () => {
      const getResponse = await api.get("/api/blogs");
      const id = getResponse.body[1].id;

      const newBlog = {
        ...getResponse.body[1],
        likes: 10000,
      };

      const putResponse = await api
        .put(`/api/blogs/${id}`)
        .send(newBlog)
        .expect(200);

      const secondGetResponse = await api.get("/api/blogs");
      const updatedBlog = secondGetResponse.body.find(
        (blog) => blog.title === newBlog.title,
      );
      assert.deepStrictEqual(updatedBlog, newBlog);

      assert.strictEqual(secondGetResponse.length, getResponse.length);
    });

    test("try to update a blog that does not exist", async () => {
      const newBlog = {
        title: "Bad update",
        author: "Doesn't matter",
        url: "Also doesn't matter",
        likes: 10000,
      };

      await api
        .put("/api/blogs/badbadbadbadbadbadbadbad")
        .send(newBlog)
        .expect(404);
    });
  });
});

after(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  await mongoose.connection.close();
});
