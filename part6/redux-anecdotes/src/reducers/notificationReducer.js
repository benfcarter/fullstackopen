import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  visible: false,
  value: '',
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action) {
      return {
        visible: true,
        value: action.payload,
      }
    },
    hideNotification(state, action) {
      return {
        visible: false,
        value: ''
      }
    }
  }
})

export const { showNotification, hideNotification } = notificationSlice.actions
export default notificationSlice.reducer