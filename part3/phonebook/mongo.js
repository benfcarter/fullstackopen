const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const numParams = process.argv.length

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const getDbUrl = (password) => {
    const username = 'fullstackopen'
    const encodedPassword = encodeURIComponent(password)
    const dbUrl = `mongodb+srv://${username}:${encodedPassword}@cluster0.zwkf0br.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    return dbUrl
}

const listEntries = (password) => {
    mongoose.connect(getDbUrl(password))

    Person.find({}).then(result => {
        console.log('phonebook:')

        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })

        mongoose.connection.close()
    })
}

const addEntry = (password, newName, newNumber) => {
    const newPerson = new Person({
        name: newName,
        number: newNumber,
    })

    mongoose.connect(getDbUrl(password))

    newPerson.save().then(result => {
        console.log(`Added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}

if(numParams === 3) {
    // Assume this is a request to list all entries
    listEntries(process.argv[2])
} else if(numParams === 5) {
    // Assume this is a request to add a new entry
    addEntry(process.argv[2], process.argv[3], process.argv[4])
} else {
    console.log('Usage: node mongo.js <password> [<newName> <newNumber>]')
}