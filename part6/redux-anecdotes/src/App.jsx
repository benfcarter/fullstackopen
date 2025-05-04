import { useSelector, useDispatch } from 'react-redux'
import { addVote, createAnecdote } from './reducers/anecdoteReducer'

const App = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()

  const vote = (id) => {
    dispatch(addVote(id))
  }

  const create = (event) => {
    event.preventDefault()
    dispatch(createAnecdote(event.target.content.value))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.sort((a, b) => {
        return a.votes > b.votes ? -1 : 1
      }).map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
      <h2>create new</h2>
      <form onSubmit={create}>
        <div><input name="content"/></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default App