const express = require('express')
const app = express()
app.use(express.json())
const generateId = () => Math.floor(Math.random() * 1000);

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
    response.json(persons)
});

app.get('/info', (request, response) => {
    response.send(`
        <div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date()}</p>
        </div>
    `)
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
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

  const alreadyExist = !!persons.find((person) => person.name === body.name);

  if (alreadyExist) {
    return response.status(400).json({
      error: "person already exists",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number || "",
  };

  persons = [...persons, person];

  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});