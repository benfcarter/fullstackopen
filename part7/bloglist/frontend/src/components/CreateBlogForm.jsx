import { useState } from "react";

const CreateBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleCreate = (event) => {
    event.preventDefault();
    const newBlog = { title, author, url };
    createBlog(newBlog);
  };

  return (
    <div>
      <form onSubmit={handleCreate}>
        <div>
          title:
          <input
            data-testid="title"
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
            className="titleTextBox"
          />
        </div>
        <div>
          author:
          <input
            data-testid="author"
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            className="authorTextBox"
          />
        </div>
        <div>
          url:
          <input
            data-testid="url"
            type="text"
            value={url}
            name="URL"
            onChange={({ target }) => setUrl(target.value)}
            className="urlTextBox"
          />
        </div>
        <button data-testid="createBlogButton" type="submit">
          create
        </button>
      </form>
    </div>
  );
};

export default CreateBlogForm;
