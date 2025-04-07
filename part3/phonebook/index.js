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

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(result => {
            response.json(result)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id.toString()
    Person.findById(id)
        .then(person => {
            if(person) {
                response.json(person)
            } else {
                response.status(404).json({ error: `Could not find person with id ${id}`})
            }
        })
        .catch(error => next(error))
})

app.get('/api/info', (request, response, next) => {
    Person.countDocuments()
        .then(result => {
            response.send(`<p>Phonebook has info for ${result} ${result === 1 ? "person" : "people"}</p><p>${Date()}</p>`)
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id.toString())
        .then(result => {
            response.status(204).end()
        })
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if(!body.name || !body.number) {
        next(error)
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    if(!body.name || !body.number) {
        next(error)
    }

    const id = request.params.id.toString()

    Person.findById(id)
        .then(person => {
            if(!person) {
                return response.status(404).json(`Tried to update person with id ${id} but no person with that id exists`)
            }

            person.name = body.name
            person.number = body.number
            person.save()
                .then(savedPerson => {
                    response.json(savedPerson)
                })
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError') {
        return response.status(400).json({ error: `Malformatted Id` })
    } else if(error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
