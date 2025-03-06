const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to:', url)
mongoose.connect(url)
.then(result => console.log('connection successful'))
.catch(error => console.log('connection was not successful'))


const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        minlength: 8,
        validate:{
            validator: v => {
                return /\d{2,3}-\d{6,10}/.test(v)
            },
            message: "Phone number was not in correct form"
        },
        required: true
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
