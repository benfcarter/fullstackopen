import { useState, useEffect } from 'react'
import personService from './services/persons'

const Person = ({ person }) => {
  return (
    <>
      {person.name} {person.number}
    </>
  )
}

const DeletePersonButton = ({ person, deleteMethod }) => {
  return (
    <button onClick={() => deleteMethod(person)}>delete</button>
  )
}

const PersonRow = ({ person, deleteMethod }) => {
  return (
    <div>
      <Person person={person} /> <DeletePersonButton person={person} deleteMethod={deleteMethod} />
    </div>
  )
}

const Persons = ({ persons, nameFilter, deleteMethod }) => {
  return (
    <>
      {persons
        .filter((x) => x.name.toUpperCase().includes(nameFilter.toUpperCase()))
        .map((x) => <PersonRow key={x.id} person={x} deleteMethod={deleteMethod} />
      )}
    </>
  )
}

const Filter = ({ filterString, onFilterStringChange }) => {
  return (
    <div>filter shown with <input value={filterString} onChange={onFilterStringChange} /></div>
  )
}

const PersonForm = ({ name, onNameChange, number, onNumberChange, addPerson }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        <div>name: <input value={name} onChange={onNameChange} /></div>
        <div>number: <input value={number} onChange={onNumberChange} /></div>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Notification = ({ notification }) => {
  if(notification === null) {
    return null
  }

  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  const successStyle = { ...errorStyle, color: 'green' }

  return (
    <div style={notification.isError ? errorStyle : successStyle}>
      {notification.message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [notification, setNotification] = useState(null)

  const notify = (message, isError, timeout = 5000) => {
    setNotification({ message, isError })

    setTimeout(() => {
      setNotification(null)
    }, timeout)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value)
  }
   
  const addPerson = (event) => {
    event.preventDefault()

    if(persons.some((person) => person.name === newName)) {
      if(confirm(`${newName} is already in the phonebook, replace the older number with a new one?`)) {
        const oldNote = persons.find(x => x.name === newName)
        const changedNote = { ...oldNote, number: newNumber }

        console.log(oldNote)
        console.log(changedNote)
        personService
        .update(changedNote)
        .then(data => {
          setPersons(persons.map(x => x.id === data.id ? data : x))
          notify(`Updated number for ${data.name}`, false)
        })
        .catch(error =>
          notify(`Update operation failed.  Error: ${error}`, true)
        )
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      }

      personService
      .create(newPerson)
      .then((data) => {
        setPersons(persons.concat(data))
        notify(`Created entry for ${data.name}`, false)
      })
      .catch(error =>
        notify(`Create operation failed.  Error: ${error}`, true)
      )
    }
  }

  const deletePerson = (person) => {
    if(confirm(`Are you sure you want to delete ${person.name}?`))
    {
      personService
      .remove(person.id)
      .then(data => {
        setPersons(persons.filter(x => x.id != person.id))
        notify(`Removed entry for ${data.name}`, false)
      })
      .catch(error =>
        notify(`Delete operation failed.  Error: ${error}`, true)
      )
    }
  }

  useEffect(() => {
    personService
    .getAll()
    .then(data => setPersons(data))
    .catch(error =>
      notify(`Could not fetch number data.  Error: ${error}`, true)
    )
  }, [])
  
  console.log(persons);
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filterString={nameFilter} onFilterStringChange={handleNameFilterChange}  />
      <h3>add a new</h3>
      <PersonForm name={newName} onNameChange={handleNameChange} number={newNumber} onNumberChange={handleNumberChange} addPerson={addPerson} />
      <h3>Numbers</h3>
      <Persons persons={persons} nameFilter={nameFilter} deleteMethod={deletePerson} />
    </div>
  )
}

export default App