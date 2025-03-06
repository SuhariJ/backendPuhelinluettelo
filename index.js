require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./modules/person.js')



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

app.get('/', (request, response) => {
  response.send('Hihii')
})

app.get('/api/persons', (request, response, next) => {

  Person.find({}).then(result => {
    response.json(result)
  })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Person({
    'name': body.name,
    'number': body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {

  Person.findById(request.params.id).then(result => {
    response.json(result)
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req,res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.json(result)
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/api/info', (req, res) => {

  Person.countDocuments({})
    .then(result => {
      res.send(`<p> this page has info for ${result} people </p>
                <div>${new Date()} </div>`)
    })
})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  }else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.listen(process.env.PORT, () => {
  console.log('Server running!')
})