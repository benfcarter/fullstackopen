import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import anecdotesService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const create = async (event) => {
    event.preventDefault()
    const content = event.target.content.value
    event.target.content.value = ''
    const newAnecdote = await anecdotesService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
  }

  return(
    <>
      <h2>create new</h2>
      <form onSubmit={create}>
        <div><input name="content"/></div>
        <button type="submit">create</button>
      </form>
    </>
  )
}

export default AnecdoteForm