import express from 'express';
import Database from 'better-sqlite3';


const app = express();
const db = new Database('tasks.db');
app.use(express.json());
const port = 3000;

// const createTable = (`CREATE TABLE IF NOT EXISTS tasks (
//  id INTEGER PRIMARY KEY,addTasks.run(task.id, task.title, task.done);
//  title TEXT,
//  done BOOLEAN 
//)`);
//db.exec(createTable);

let tasks = [
  {"id": 1, "title": "Chemistry", "done": false},
  {"id": 2, "title": "Biology", "done": false},
  {"id": 3, "title": "Maths", "done": true}
];

const addTasks = db.prepare("INSERT INTO tasks (id, title, done) VALUES (?, ?, ?)");
// tasks.forEach((task) => {
//   addTasks.run(task.id, task.title, Number(task.done));
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

app.post('/tasks', (req, res) => {
  const { title } = req.body;

  if (!title) {
      res.status(400).send("Title is missing.");
  } else {
      const newTask = {
        id: tasks.length + 1,
        title: title,
        done: false
      }

      tasks.push(newTask);
      res.status(200).json(newTask);}
    });

app.put('/tasks/:id', (req, res) => {
  // const title = req.body.title;
  // const done = req.body.done;
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    res.status(404).send("Task doesn't exist.");
  } else if (!(typeof req.body.title === "string")) {
      res.status(400).send("Title must be a string.");
  } else {
    task.title = req.body.title;
    task.done = req.body.done;
    res.status(200).json(task);
  }
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (taskId === -1) {
    res.status(404).send("Task doesn't exist.");
  } else {
    const task = tasks.splice(taskId, 1);
    res.status(204).json(task);
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

db.close();