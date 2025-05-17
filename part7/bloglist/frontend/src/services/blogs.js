import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newBlog) => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.post(baseUrl, newBlog, config);
  return request.then(response => response.data);
};

const replace = (updatedBlog) => {
  const request = axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog);
  return request.then(response => response.data);
};

const like = (blogToLike) => {
  const updatedBlog = {...blogToLike, likes: blogToLike.likes + 1}
  return replace(updatedBlog)
}

const remove = (blogToRemove) => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.delete(`${baseUrl}/${blogToRemove.id}`, config);
  return request.then(response => response.data);
};

const addComment = ({ blogId, comment }) => {
  const request = axios.post(`${baseUrl}/${blogId}/comments`, { comment });
  return request.then(response => response.data)
}

export default { getAll, setToken, create, replace, like, remove, addComment };
