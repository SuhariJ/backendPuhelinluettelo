const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('postReq', function(req) {return JSON.stringify(req.body)})

const logger = morgan(function (tokens, req,res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.postReq(req)
    ].join(' ')
})

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(logger)

let persons = [
     {
        "name": "Ada Lovelace",
        "number": " 123123123",
        "id": "2"
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
      }
]

app.get('/', (request, response) =>{
    response.send('Hihii')
})

app.get('/api/persons', (request, response) =>{
    response.json(persons) 
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if(onkoTallennettu(body.name)){
        return res.status(400).json({
            error: "name must be unique"
        })
    }
    if(!body.name){
        return res.status(400).json({
            error: "name missing"
        })
    }
    if(!body.number){
        return res.status(400).json({
            error: "number missing"
        })
    }

    const id = randBetween(3, 1000)
    const person = {
        "name": body.name,
        "number": body.number,
        "id": id
    }
    persons = persons.concat(person)

    res.json(person)
})

app.get('/api/persons/:id', (request, response) =>{
    const person = persons.find(p => request.params.id == p.id)
    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (req,res) =>{
    const id = req.params.id
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

app.get('/api/info', (req, res) => {
    const count = persons.length
    res.send(`<p> this page has info for ${count} people </p>
                <div>${new Date()} </div>`)
})

const randBetween = (min, max) => {
    const valinPituus = Math.abs(max-min)
    return Math.floor(valinPituus * Math.random()) + min
}

const onkoTallennettu = (name) => {
    const bool = persons.find(p => p.name.toLowerCase() == name.toLowerCase())
    if(bool) {
        return true
    }
    return false
    
}


app.listen(3001, () =>{
    console.log('Server running!')
})