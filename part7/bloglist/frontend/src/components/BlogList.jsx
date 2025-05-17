import { Link } from "react-router-dom"
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from "@mui/material"

import { useBlogQuery } from "../queries/blogQuery"

const BlogList = () => {
  const blogQuery = useBlogQuery()
  const blogs = blogQuery.data

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell>
                <Link data-testid="blogEntry" to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </TableCell>
              <TableCell>
                {blog.author}
              </TableCell>
              <TableCell>
                {blog.likes} like{blog.likes === 1 ? '' : 's'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default BlogList