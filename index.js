require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/persons')

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

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((person) => {
        response.json(person);
  });
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
});

app.post("/api/persons", (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: "Missing name",
        });
    }

    if (!body.number) {
        return response.status(400).json({
            error: "Missing number",
        });
    }

    // Проверка на наличие имени в базе данных
    Person.findOne({ name: body.name })
        .then(existingPerson => {
            if (existingPerson) {
                return response.status(400).json({
                    error: "person already exists",
                });
            }

            // Создание новой записи, если контакт с таким именем не найден
            const person = new Person({
                name: body.name,
                number: body.number
            });

            person.save()
                .then(savedPerson => {
                    response.json(savedPerson);
                })
                .catch(error => {
                    response.status(500).json({
                        error: "an error occurred while saving the person"
                    });
                });
        })
        .catch(error => {
            response.status(500).json({
                error: "an error occurred while checking the database"
            });
        });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});