const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(x => x.id === id)

    if(person) {
        response.json(person)
    } else {
        response.status(404).send(`No person found with id ${id}`)
    }
})

app.get('/api/info', (request, response) => {

    response.send(`<p>Phonebook has info for ${persons.length} ${persons.length === 1 ? "person" : "people"}</p><p>${Date()}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(x => x.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const nextId = persons.length > 0
    // ? Math.max(...persons.map(x => Number(x.id))) + 1
    ? Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    : 0

    return nextId
}

app.post('/api/persons', (request, response) => {
    const person = request.body

    if(!person.name || !person.number) {
        return response.status(400).json({
            error: 'Phonebook entries must contain both a "name" and "number"'
        })
    }

    if(persons.some(x => x.name.toUpperCase() === person.name.toUpperCase())) {
        return response.status(400).json({
            error: `There is already an phone book entry for ${person.name}`
        })
    }

    person.id = generateId()
    persons = persons.concat(person)

    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
