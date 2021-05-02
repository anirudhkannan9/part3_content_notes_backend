//primary purpose of backend server in this course is to serve raw data (JSON format) to the frontend


//imports Node's built-in web server module (CommonJS module; functions similarly to ES6 modules)
//code that runs in the browser uses ES6 modules
const http = require('http')

//imports Express, a library that makes it easier to work with Node's built-in web server module, which is cumbersome to scale
const express = require('express')

//rn, express is a function that is used to create the application that is stored in the app variable
const app = express()

//app use express json-parser to access JSON data sent to our endpoints
app.use(express.json())

const cors = require('cors')
app.use(cors())

//define middleware that prints info re: every request sent to the server
const requestLogger = (request, response, next) => {
  console.log('Method: ', request.method)
  console.log('Path: ', request.path)
  console.log('Body: ', request.body)
  next()
}

//use middleware
app.use(requestLogger)


let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2019-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2019-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2019-05-30T19:20:14.298Z",
      important: true
    }
  ]


//routes: 

//event handler that handles GET requests to http://localhost:3001; first param contains details of HTTP request, 2nd param defines how request is responded to 
app.get('/', (request, response) => {
    //since response.send param is string, express automatically sets content-type to be html
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

    //expanding application so it offers a REST interface to operate on individual notes

    app.get('/api/notes/:id', (request, response) => {
        const id = Number(request.params.id)
        const note = notes.find(note => note.id === id)
        if (note) {
            response.json(note)
        } else {
            //Don't need to show anything in browser because REST APIs are interfaces intende for programmatic use; status code is enough
            response.status(404).end()
        }
        
    })


    const generateId = () => {
      const maxId = notes.length > 0 
      ? Math.max(...notes.map(note => note.id))
      : 0

      return maxId + 1

    }

    app.post('/api/notes', (request, response) => {
      const body = request.body

      if (!body.content) {
        return response.status(400).json({
          error: 'content missing'
        })
      }

      console.log(request)

      const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId()
      }

      notes = notes.concat(note)
      response.json(note)
      //console.log('headers sent with note: ', request.headers)
    })


//define + use middleware for catching requests made to unknown endpoints:
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


//binds server to app variable; listens to HTTP requests made at this port (3001)
const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`server running on ${PORT}`)