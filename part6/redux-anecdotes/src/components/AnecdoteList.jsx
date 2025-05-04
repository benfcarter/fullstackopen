import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()

  const anecdotes = useSelector(state => {
    return state.anecdotes
      .filter(x => x.content.toLowerCase().includes(state.filter.toLowerCase()))
      .sort((a, b) => a.votes > b.votes ? -1 : 1)
  })

  const vote = (id) => {
    dispatch(addVote(id))
  }

  return (
    <>
      {anecdotes.map(anecdote =>
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
    </>    
  )
}

export default AnecdoteList