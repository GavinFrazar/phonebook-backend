require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();
app.use(express.static("build"));
app.use(express.json());
app.use(cors());
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

let persons = [
  {
    name: "Artos Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
];

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((people) => people.toJSON())
    .then((peopleJSON) => {
      res.json(peopleJSON);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Person.findByIdAndRemove(id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    res.status(400).json({
      error: "must provide name and number",
    });
    return;
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  Person.init()
    .then(() => newPerson.save())
    .then((savedPerson) => savedPerson.toJSON())
    .then((savedPersonJSON) => res.json(savedPersonJSON))
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  const id = req.params.id;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(id, person, { new: true })
    .then((updatedPerson) => updatedPerson.toJSON())
    .then((updatedPersonJSON) => res.json(updatedPersonJSON))
    .catch((error) => next(error));
});

app.get("/info", (req, res) => {
  Person.countDocuments({})
    .then((person_count) => {
      const date = new Date();
      const body = [
        `<div>Phonebook has info for ${person_count} people</div>`,
        "<br>",
        `${date}`,
      ];

      res.send(body.join(""));
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.log(error);
  console.log(Object.getOwnPropertyNames(error));

  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "MongoError" && error.code === 11000) {
    return res.status(400).send({ error: "Duplicate name in phonebook" });
  }

  next(error);
};

app.use(errorHandler);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
