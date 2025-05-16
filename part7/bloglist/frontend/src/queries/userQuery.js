import { useQuery } from "@tanstack/react-query"
import userService from "../services/users"

export const useUserQuery = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll()
  })
}
