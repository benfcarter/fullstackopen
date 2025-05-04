import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  const style = notification.visible ?
  {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  } : {
    display: 'none'
  }

  return (
    <div style={style}>
      {notification.value}
    </div>
  )
}

export default Notification