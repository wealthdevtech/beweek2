import express from 'express';

const app = express();
const port = 3000;

let tasks = [
  {"id": 1, "title": "Chemistry", "done": false},
  {"id": 2, "title": "Biology", "done": false},
  {"id": 3, "title": "Maths", "done": true}
];

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

app.get('/', (req, res) => {
  res.send({ "name": "Task API", 
             "version": "1.0", 
             "endpoints": ["/tasks"] });
});

app.get('/health', (req, res) => {
  res.json({"status": "ok"});
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  //const id = parseInt(req.params.id); //converts req.params to an int
  const id = tasks.find(task => task.id === parseInt(req.params.id)); //find the id from tasks, first
  if (!id) {
    res.status(404).json({"error": `task ${req.params.id} not found`});
  }
  res.json(id)
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});