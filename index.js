require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/persons');

app.use(express.json());
// Настраиваем Morgan для логирования. 
// В этом примере мы логируем стандартный 'tiny' формат + тело запроса.
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));
app.use(cors());

const generateId = () => Math.floor(Math.random() * 1000);

app.use(express.static('build'));

// Создаем токен для Morgan, чтобы логировать тело запроса
morgan.token('body', function (req) { 
    return JSON.stringify(req.body);
});

let persons = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345",
    },
    {
      id: 4,
      name: "Mary Poppendieck",
      number: "39-23-6423122",
    },
];

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  });
});

app.get('/info', (request, response) => {
    response.send(`
        <div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date()}</p>
        </div>
    `)
});

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: 'person not found' });
      }
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
      name: body.name,
      number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
          response.json(updatedPerson);
      })
      .catch(error => next(error));
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    response.status(404).json({
      error: "Missing name",
    });
  }

  if (!body.number) {
    return response.status(404).json({
      error: "Missing number",
    });
  }

  const person = new Person({
    id: generateId(),
    name: body.name,
    number: body.number || "",
  });

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } 
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});