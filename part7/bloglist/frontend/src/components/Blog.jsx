import { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, userId, replaceBlog, removeBlog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const showDetailsStyle = { display: showDetails ? "" : "none" };
  const hideDetailsStyle = { display: showDetails ? "none" : "" };

  const shouldShowDelete = userId === blog.user.id;
  const removeButtonStyle = { display: shouldShowDelete ? "" : "none" };

  const handleLike = (event) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };

    blog.likes++;

    replaceBlog(updatedBlog);
  };

  const handleRemove = (event) => {
    removeBlog(blog);
  };

  return (
    <div data-testid="blogEntry" style={blogStyle} className="titleAuthor">
      {blog.title} {blog.author}
      <button
        data-testid="showDetails"
        onClick={toggleDetails}
        className="showButton"
      >
        {showDetails ? "hide" : "show"}
      </button>
      <div style={showDetailsStyle} className="details">
        <div className="url">{blog.url}</div>
        <div className="likes">
          likes {blog.likes}{" "}
          <button onClick={handleLike} className="likeButton">
            like
          </button>
        </div>
        <div className="name">{blog.user.name}</div>
        <div style={removeButtonStyle}>
          <button onClick={handleRemove}>remove</button>
        </div>
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  replaceBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
};

export default Blog;
