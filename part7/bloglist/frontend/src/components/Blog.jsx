import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import PropTypes from "prop-types";

import { useShowNotification } from "../contexts/NotificationContext";

import blogService from "../services/blogs";

const Blog = ({ blog, userId }) => {
  const [showDetails, setShowDetails] = useState(false);

  const queryClient = useQueryClient()

  const showNotification = useShowNotification()

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

  const likeBlogMutation = useMutation({
    mutationFn: blogService.like,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const removeBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const handleLike = (event) => {
    likeBlogMutation.mutate(blog)
  };

  const handleRemove = (event) => {
    showNotification(`Removed ${blog.title}`, false);
    removeBlogMutation.mutate(blog)
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
};

export default Blog;
