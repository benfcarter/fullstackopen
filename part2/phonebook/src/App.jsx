import { useState, useEffect } from 'react'
import axios from 'axios'

const Person = ({ person }) => {
  return (
    <div>{person.name} {person.number}</div>
  )
}

const Persons = ({ persons, nameFilter }) => {
  return (
    <>
      {persons
        .filter((x) => x.name.toUpperCase().includes(nameFilter.toUpperCase()))
        .map((x) => <Person key={x.id} person={x} />)}
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

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  const personUrl = 'http://localhost:3001/persons'

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
      alert(`${newName} is already in the phonebook`)
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      }

      axios
      .post(personUrl, newPerson)
      .then(response => {
        setPersons(persons.concat(response.data))
      })
    }
  }

  useEffect(() => {
    axios
    .get(personUrl)
    .then(response => setPersons(response.data))
  }, [])
  
  console.log(persons);
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterString={nameFilter} onFilterStringChange={handleNameFilterChange}  />
      <h3>add a new</h3>
      <PersonForm name={newName} onNameChange={handleNameChange} number={newNumber} onNumberChange={handleNumberChange} addPerson={addPerson} />
      <h3>Numbers</h3>
      <Persons persons={persons} nameFilter={nameFilter}/>
    </div>
  )
}

export default App