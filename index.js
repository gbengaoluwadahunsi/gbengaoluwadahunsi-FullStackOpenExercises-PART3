//Always install morgan as one of your middlewares

const express = require("express");
var morgan = require("morgan");
const app = express();
const cors = require("cors");

app.use(cors());

//morgan
morgan.token("id", function getId(res, req) {
  return req.id;
});
app.use(morgan(":id :method :url :response-time"));

const PORT = process.env.PORT || 3005;

app.use(express.json());

let notes = [
  {
    id: 1,
    content: "No gree for anybody",
    important: true,
  },
  {
    id: 2,
    content: "You will never be forever young, maximize your moments",
    important: true,
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello LAMBANO<h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(id);
  const note = notes.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

//check if name already exists
const content = "body.content";
let find_content = notes.find(
  (find_content) => find_content.content === content
);

app.post("/api/notes", (request, response) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({
      error: "note missing",
    });
  }

  const note = {
    id: Math.floor(300 * Math.random()),
    content: body.content,
    important: true,
  };

  notes = notes.concat(note);
  console.log(note);
  response.json(note);
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

