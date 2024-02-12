const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const content = process.argv[3];
const important = process.argv[4];

const url = `mongodb+srv://fullstack:${password}@knocks.na6hgt3.mongodb.net/knocksApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

//add a note to the database

if (process.argv.length > 3) {
  console.log("this adds a note to the database \n");

  const note = new Note({
    content: content,
    important: important,
  });

  note
    .save()
    .then((result) => {
      console.log(
        `Added '${content}' with importance set to '${important}' to the knocksApp.`
      );
      mongoose.connection.close();
    })
    .catch((error) => {
      console.log("Error adding note:", error);
      mongoose.connection.close();
    });
}

if (process.argv.length === 3) {
  console.log("this prints all the notes in the database \n");
  // Print out all the notes in the database
  Note.find({})
    .then((result) => {
      console.log("Knocks app Notes:");
      result.forEach((note) => {
        console.log(`${note.content} ${note.important}`);
      });
      mongoose.connection.close();
    })
    .catch((error) => {
      console.log("Error fetching notes:", error);
      mongoose.connection.close();
    });
}

// Fetch notes with unique properties
// Note.find({ important: true }).then(result => { // Uncomment this block if needed
//   // ...
// });
