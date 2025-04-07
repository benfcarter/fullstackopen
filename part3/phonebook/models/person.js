const mongoose = require("mongoose")

mongoose.set('strictQuery', false)

const dbUrl = process.env.MONGODB_URI

console.log(`Connecting to Mongo DB at ${dbUrl}`)
mongoose.connect(dbUrl)
    .then(result => {
        console.log(`Connected to Mongo DB at ${dbUrl}`)
    })
    .catch(error => {
        console.log(`Error connecting to Mongo DB at ${dbUrl}: ${error.message}`)
    })

const numberValidator = (v) => {
    // Regex that represents two or three digits, followed by a hyphen, followed by a string of digits
    return /^\d{2,3}-\d+$/.test(v)
}

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
    },
    number: {
        type: String,
        validate: {
            validator: numberValidator,
        }
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)