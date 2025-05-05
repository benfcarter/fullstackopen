import { createSlice, current } from '@reduxjs/toolkit'

const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    addVote(state, action) {
      return state.map(x => 
        x.id === action.payload ? {...x, votes: x.votes + 1} : x
      )
    },
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
  }
})

export const { addVote, createAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer