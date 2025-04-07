require('dotenv').config()

const express = require('express')
const Person = require('./models/person')
const morgan = require('morgan')

const app = express()

app.use(express.static('dist'))
app.use(express.json())

app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(' ')
}))

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
    Person.find({})
        .then(result => {
            response.json(result)
        })
        .catch(error => {
            console.log(`Error fetching person data: ${error.message}`)
            response.status(404).end()
        })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id.toString())
        .then(person => {
            response.json(person)
        })
        .catch(error => {
            response.status(404).json({ error: `Could not find person with id ${request.params.id}`})
        })
})

app.get('/api/info', (request, response) => {
    Person.countDocuments()
        .then(result => {
            console.log(result)
            response.send(`<p>Phonebook has info for ${result} ${result === 1 ? "person" : "people"}</p><p>${Date()}</p>`)
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id.toString())
        .then(result => {
            response.status(204).end()
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'Phonebook entries must contain both a "name" and "number"'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => {
            response.status(409).json({
                error: `Error adding person to DB: ${error.message}`
            })
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
