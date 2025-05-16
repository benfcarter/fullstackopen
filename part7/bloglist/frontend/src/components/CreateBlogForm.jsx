import { useState, useRef } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useShowNotification } from "../contexts/NotificationContext";

import blogService from "../services/blogs";

import Togglable from "../components/Togglable";

const CreateBlogForm = () => {
  const blogFormRef = useRef();

  const showNotification = useShowNotification()

  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (data) => {
      blogFormRef.current.toggleVisibility();
      showNotification(
        `a new blog ${data.title} by ${data.author} added`,
        false,
      );
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const handleCreate = (event) => {
    event.preventDefault();
    const newBlog = {
      title: event.target.title.value,
      author: event.target.author.value,
      url: event.target.url.value,
    };
    event.target.title.value = ''
    event.target.author.value = ''
    event.target.url.value = ''
    newBlogMutation.mutate(newBlog);
  };

  return (
  <Togglable buttonLabel="new blog" ref={blogFormRef}>
    <h2>create new</h2>
    <form onSubmit={handleCreate}>
      <div>
        title:
        <input
          data-testid="title"
          type="text"
          name="title"
          className="titleTextBox"
        />
      </div>
      <div>
        author:
        <input
          data-testid="author"
          type="text"
          name="author"
          className="authorTextBox"
        />
      </div>
      <div>
        url:
        <input
          data-testid="url"
          type="text"
          name="url"
          className="urlTextBox"
        />
      </div>
      <button data-testid="createBlogButton" type="submit">
        create
      </button>
    </form>
  </Togglable>
  );
};

export default CreateBlogForm;
