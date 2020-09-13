const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
app.use(express.json());
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
app.use(cors());
app.use(express.static("build"));

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

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

const generateUniqueID = () => {
  return Math.floor(1000000 * Math.random()); // one in a million this fails ;D
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    res.status(400).json({
      error: "must provide name and number",
    });
    return;
  }

  if (persons.find((person) => person.name === body.name)) {
    res.status(400).json({
      error: "name must be unique",
    });
    return;
  }

  const uniqueID = generateUniqueID();
  const newPerson = {
    name: body.name,
    number: body.number,
    id: uniqueID,
  };

  persons = persons.concat(newPerson);

  res.json(newPerson);
});

app.get("/info", (req, res) => {
  const date = new Date();
  const body = [
    `<div>Phonebook has info for ${persons.length} people</div>`,
    "<br>",
    `${date}`,
  ];

  res.send(body.join(""));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
