import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

import BlogList from "./BlogList"
import CreateBlogForm from "./CreateBlogForm"

const BlogListView = () => {
  return (
    <div>
      <Accordion data-testid="create_blog">
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
          Create new blog
        </AccordionSummary>
        <AccordionDetails>
          <CreateBlogForm />
        </AccordionDetails>
      </Accordion>
      <BlogList />
    </div>
  )
}

export default BlogListView