//Always install morgan as one of your middlewares
const express = require("express");
var morgan = require("morgan");
const app = express();
const cors = require("cors");
require("dotenv").config();
const Note = require("./models/note");

app.use(cors());

//morgan
morgan.token("id", function getId(req) {
  return req.id;
});
app.use(morgan(":id :method :url :response-time"));

const PORT = 3005;

//use the front end  build file as  index html in the backend server so that the frontend and the backend  are on the same  url
app.use(express.static("dist"));
app.use(express.json());

// let notes = [
//   {
//     id: 1,
//     content: "No gree for anybody",
//     important: true,
//   },
//   {
//     id: 2,
//     content: "You will never be forever young, maximize your moments",
//     important: true,
//   },
// ];

app.get("/", (request, response) => {
  response.send("<h1>Hello LAMBANO<h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

//get  individual note
app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })

    .catch((error) => next(error));
});

//Error handling function

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

//post a new note

//check if name already exists
const content = "body.content";
// let find_content = notes.find(
//   (find_content) => find_content.content === content
// );

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  if (body.content === content) {
    return response.status(400).json({
      error: "content already exists",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

//delete a note

app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
      console.log(result);
    })
    .catch((error) => next(error));
});

//toggle  a note importance
app.put("/api/notes/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

// this has to be the last loaded middleware.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
