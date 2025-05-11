const { test, after, beforeEach, describe } = require("node:test");
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const supertest = require("supertest");
const assert = require("node:assert");
const app = require("../app");
const User = require("../models/user");

const api = supertest(app);

describe("when there are some users saved already", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcryptjs.hash("sekret", 10);
    const user = new User({
      username: "root",
      passwordHash: passwordHash,
      name: "Bob",
    });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      username: "bigbc79",
      name: "Ben Carter",
      password: "TheBestPassword",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-type", /application\/json/);

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    assert(usernames.includes("bigbc79"));
  });

  test("creation fails with a missing username", async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      name: "Ben Carter",
      password: "TheBestPassword",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);

    assert(response.body.includes("Missing username"));
  });

  test("creation fails with a username that is too short", async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      username: "x",
      name: "Ben Carter",
      password: "TheBestPassword",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);

    const usersAtEnd = await User.find({});

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);

    assert(response.body.includes("must be at least"));
  });

  test("creation fails with a missing password", async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      username: "bigbc79",
      name: "Ben Carter",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);

    assert(response.body.includes("Missing password"));
  });

  test("creation fails with a password that is too short", async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      username: "bigbc79",
      name: "Ben Carter",
      password: "a",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);

    const usersAtEnd = await User.find({});

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);

    assert(response.body.includes("must be at least"));
  });
});

after(async () => {
  await mongoose.connection.close();
});
