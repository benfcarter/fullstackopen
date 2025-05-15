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

const create = async (newBlog) => {
  console.log(`Creating blog...`)
  console.log(newBlog)
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const replace = async (updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog);
  return response.data;
};

const like = async (blogToLike) => {
  const updatedBlog = {...blogToLike, likes: blogToLike.likes + 1}
  return await replace(updatedBlog)
}

const remove = (blogToRemove) => {
  console.log(`Removing blog ${blogToRemove.title}`);
  const config = {
    headers: { Authorization: token },
  };

  const response = axios.delete(`${baseUrl}/${blogToRemove.id}`, config);
  return response.data;
};

export default { getAll, setToken, create, replace, like, remove };
