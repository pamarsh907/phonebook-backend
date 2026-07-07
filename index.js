require('dotenv').config()
const express = require('express')
const Person = require('./models/person')

const app = express()
var morgan = require('morgan')

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }

app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))


app.get('/', (request, response) => {
  response.send('<h1>Hello World!!!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

async function getCount() {
  const docCount = await Person.estimatedDocumentCount({}).exec()
  return docCount
}

app.get('/info', async (request, response) => {
    const count = await Person.countDocuments({})
    const timeStamp = new Date()

    response.send(`<div>Phonebook has info for ${count} people</div><br/><div>${timeStamp}</div>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  Person.findById(request.params.id).then(person => {
    response.json(person)
  })

  // if (person) {
  //     response.json(person)
  // } else {
  //     response.status(404).end()
  // }
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    response.json(204).end()
  })

  // const id = request.params.id

  // if(!persons.find(person => person.id === id)){
  //   return response.status(400).json({ 
  //     error: 'already been deleted' 
  //   })
  // }

  // persons = persons.filter(person => person.id !== id)
  // response.status(204).end()
})

// const generateId = () => {
//   return String(Math.floor(Math.random() * 10000) + 1);
// }

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  // if (persons.map(person => person.name).includes(body.name)) {
  //   return response.status(400).json({ 
  //     error: 'name must be unique' 
  //   })    
  // }

  // const person = {
  //   name: body.name,
  //   number: body.number,
  //   id: generateId(),
  // }

  // persons = persons.concat(person)

  // response.json(person)

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.put('/api/persons/:id', (request, response) => {
  const query = { id: request.params.id }
  Person.findOneAndUpdate(query, { number: request.body.number }, { new: true})
    .then(updatedPerson => response.json(updatedPerson))

  // const body = request.body

  // const newPerson = {
  //   name: body.name,
  //   number: body.number,
  //   id: request.params.id
  // }

  // persons = persons.map(person => person.id === newPerson.id ? newPerson : person)

  // response.json(newPerson)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)