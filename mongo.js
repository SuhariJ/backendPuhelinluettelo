const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log("give password as argument")
    process.exit(1)
}

const passwd = process.argv[2]

const url = `mongodb+srv://suharisuhonen:${passwd}@puhelinluettelo.phgek.mongodb.net/PhonebookApp?retryWrites=true&w=majority&appName=puhelinluettelo`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const personName = process.argv[3]
const personNumber = process.argv[4]

if(process.argv[3] === undefined){
    Person.find({}).then(result => {
        result.forEach(p => console.log(p))
        mongoose.connection.close()   
    })
    return
}

const person = new Person({
    name: personName,
    number: personNumber || "",
})

person.save().then(result => {
    console.log(`Person ${personName} with number ${personNumber} was saved to phonebook`)
    mongoose.connection.close()
})