import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { showNotification, hideNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()

  const anecdotes = useSelector(state => {
    return state.anecdotes
      .filter(x => x.content.toLowerCase().includes(state.filter.toLowerCase()))
      .sort((a, b) => {
        if(a.votes > b.votes) {
          return -1
        } else if (a.votes < b.votes) {
          return 1
        }
        return 0
      })
  })

  const vote = async (anecdote) => {
    dispatch(addVote(anecdote))

    const selectedAnecdote = anecdotes.filter(x => x.id === anecdote.id)[0]
    dispatch(showNotification(`you voted '${selectedAnecdote.content}`))

    setTimeout(() => {
      dispatch(hideNotification())
    }, 5000)
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
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </>    
  )
}

export default AnecdoteList