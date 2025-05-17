import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  Button,
  TextField,
} from '@mui/material'

import { useShowNotification } from "../contexts/NotificationContext";

import blogService from "../services/blogs";

const CreateBlogForm = () => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  const showNotification = useShowNotification()

  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (data) => {
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
      title,
      author,
      url,
    };

    console.log(newBlog)

    setTitle('')
    setAuthor('')
    setUrl('')
    newBlogMutation.mutate(newBlog);
  };

  return (
    <form onSubmit={handleCreate}>
      <div>
        <TextField label="title"
          data-testid="title"
          type="text"
          name="title"
          className="titleTextBox"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        <TextField label="author"
          data-testid="author"
          type="text"
          name="author"
          className="authorTextBox"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        <TextField label="url"
          data-testid="url"
          type="text"
          name="url"
          className="urlTextBox"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <Button data-testid="createBlogButton" variant="contained" color="success" type="submit">
        create
      </Button>
    </form>
  );
};

export default CreateBlogForm;
