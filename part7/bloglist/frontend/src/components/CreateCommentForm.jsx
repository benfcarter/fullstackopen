import { useQueryClient, useMutation } from '@tanstack/react-query'

import blogService from "../services/blogs"

const CreateCommentForm = ({ id }) => {
  const queryClient = useQueryClient()

  const newCommentMutation = useMutation({
    mutationFn: blogService.addComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['blogs'])
    }
  })

  const handleCreate = (event) => {
    event.preventDefault()
    newCommentMutation.mutate({
      blogId: id,
      comment: event.target.comment.value
    })
  }

  return (
    <div>
      <form onSubmit={handleCreate}>
        <input data-testid="comment" type="text" name="comment" />
        <button type="submit">add comment</button>
      </form>
    </div>
  )
}

export default CreateCommentForm