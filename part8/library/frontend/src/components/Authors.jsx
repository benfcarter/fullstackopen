import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import Select from 'react-select'

import { ALL_AUTHORS } from '../queries/queries'
import { UPDATE_AUTHOR } from '../queries/mutations'

const Authors = (props) => {
  const [selectedName, setSelectedName] = useState(null)
  const [birthyear, setBirthyear] = useState('')

  const allAuthorsResult = useQuery(ALL_AUTHORS)
  const [ updateAuthor ] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  if (!props.show) {
    return null
  }

  if (allAuthorsResult.loading) {
    return null
  }
 
  const authors = allAuthorsResult.data.allAuthors

  const onBirthyearSubmit = (event) => {
    event.preventDefault()
    
    if(!selectedName) {
      return
    }

    updateAuthor({ variables: { name: selectedName.value, birthyear: parseInt(birthyear) }})
    
    setSelectedName(null)
    setBirthyear('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={onBirthyearSubmit}>
        <Select
          defaultValue={selectedName}
          onChange={setSelectedName}
          options={authors.map(a => ({
            value: a.name,
            label: a.name
          }))}
        />
        <div>born<input value={birthyear} onChange={ ({target}) => setBirthyear(target.value)} /></div>
        <div><button type="submit">update author</button></div>
      </form>
    </div>
  )
}

export default Authors
