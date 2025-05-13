import { createContext, useReducer } from "react"

const blogListReducer = (state, action) => {
  switch(action.type) {
    case 'ADD_BLOG':
      return state.concat(action.payload)
    case 'LIKE':
      return state.map(x => x.id === action.payload ? {...x, likes: x.likes + 1} : x)
    default:
      return state
  }
}

const BlogListContext = createContext()

export const BlogListContextProvider = (props) => {
  const [blogList, setBlogList] = useReducer(blogListReducer, [])

  return (
    <BlogListContext.Provider value={[blogList, setBlogList]}>
      {props.children}
    </BlogListContext.Provider>
  )
}

export default BlogListContext