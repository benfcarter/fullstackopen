const initialState = ''

const filterReducer = (state = initialState, action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch (action.type) {
    case 'CHANGE_FILTER':
      return action.payload
  }

  return state
}

export const changeFilter = (newFilter) => {
  return {
    type: 'CHANGE_FILTER',
    payload: newFilter
  }
}

export default filterReducer