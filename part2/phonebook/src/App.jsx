import { useState } from 'react'

const NumberEntry = ({ number }) => {
  return (
    <div>{number.name} {number.number}</div>
  )
}

const NumberList = ({ numbers, nameFilter }) => {
  return (
    <>
      {numbers
        .filter((x) => x.name.toUpperCase().includes(nameFilter.toUpperCase()))
        .map((x) => <NumberEntry key={x.name} number={x} />)}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    {
      name: 'Arto Hellas',
      number: '040-1234567'
    }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()

    if(persons.some((person) => person.name === newName)) {
      alert(`${newName} is already in the phonebook`)
    } else {
      setPersons(persons.concat({
        name: newName,
        number: newNumber
      }))
    }
  }

  console.log(persons);
  
  return (
    <div>
      <h1>Phonebook</h1>
      <div>filter shown with <input value={nameFilter} onChange={handleNameFilterChange} /></div>
      <h2>add a new</h2>
      <form onSubmit={addName}>
        <div>
          <div>name: <input value={newName} onChange={handleNameChange} /></div>
          <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <NumberList numbers={persons} nameFilter={nameFilter}/>
    </div>
  )
}

export default App