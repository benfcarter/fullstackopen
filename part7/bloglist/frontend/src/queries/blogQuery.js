import { useQuery } from "@tanstack/react-query"
import blogService from "../services/blogs"

export const useBlogQuery = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAll().then((data) => data.sort((a, b) => b.likes - a.likes))
  })
}
