const mongoose = require('mongoose')
const { log } = require('node:console')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const paramCount = process.argv.length - 2

const url = `mongodb+srv://fullstackopen:${password}@cluster0.qnzenbx.mongodb.net/?appName=Cluster0`

mongoose.set('strictQuery',false)

require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

//if one argument, list
if (paramCount === 1) {
    console.log('phonebook:')
    
    Person.find({}).then(result => {
    result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
    })   
}

//if more arguments add
if (paramCount === 3) {
    const person = new Person({
    name: name,
    number: number,
    })

    person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
    })
}

// Note.find({}).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })

// Note.find({ important: true }).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })