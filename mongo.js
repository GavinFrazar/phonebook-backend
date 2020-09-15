const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Provide password as an argument: node mongo.js <password>");
  process.exit(1);
}

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log(
    "Wrong number of arguments: node mongo.js <password> <name> <number>"
  );
  process.exit(1);
}

const password = process.argv[2];
const newName = process.argv[3];
const newNumber = process.argv[4];
const url = `mongodb+srv://fullstack:${password}@testcluster.o1iaw.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  console.log("phonebook:");

  Person.find({}).then((res) => {
    res.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else {
  const newPerson = new Person({
    name: newName,
    number: newNumber,
  });

  newPerson.save().then((res) => {
    console.log(`added ${newName} number ${newNumber} to phonebook`);
    mongoose.connection.close();
  });
}
