import deepFreeze from 'deep-freeze'
import counterReducer from './reducer'

const performAction = (state, actionName) => {
  const action = {
    type: actionName
  }

  deepFreeze(state)
  return counterReducer(state, action)
}

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('should return a proper initial state when called with undefined state', () => {
    const state = {}
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const newState = performAction(initialState, 'GOOD')
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })

  test('okay is incremented', () => {
    const newState = performAction(initialState, 'OK')
    expect(newState).toEqual({
      good: 0,
      ok: 1,
      bad: 0
    })
  })

  test('bad is incremented', () => {
    const newState = performAction(initialState, 'BAD')
    expect(newState).toEqual({
      good: 0,
      ok: 0,
      bad: 1
    })
  })

  test('state is reset', () => {
    const goodState = performAction(initialState, 'GOOD')
    const newState = performAction(goodState, 'ZERO')
    expect(newState).toEqual({
      good: 0,
      ok: 0,
      bad: 0
    })
  })
})