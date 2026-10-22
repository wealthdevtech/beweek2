import express from 'express';
import Database from 'better-sqlite3';


const app = express();
const db = new Database('tasks.db');
app.use(express.json());
const port = 3000;

// const createTable = (`CREATE TABLE IF NOT EXISTS tasks (
//  id INTEGER PRIMARY KEY,
//  title TEXT,
//  done BOOLEAN 
//)`);
//db.exec(createTable);

let tasks = [
  {"id": 1, "title": "Chemistry", "done": false},
  {"id": 2, "title": "Biology", "done": false},
  {"id": 3, "title": "Maths", "done": true}
];

// const addTasks = db.prepare("INSERT INTO tasks IF NOT EXISTS (id, title, done) VALUES (?, ?, ?)");
//  tasks.forEach((task) => {
//    addTasks.run(task.id, task.title, 0);
//  });

app.get('/', (req, res) => {
  res.send({ "name": "Task API", 
             "version": "1.0", 
             "endpoints": ["/tasks"] });
});

app.get('/health', (req, res) => {
  res.json({"status": "ok"});
});

app.get('/tasks', (req, res) => {
    const getTasks = db.prepare("SELECT * FROM tasks");
    res.json(getTasks.all());
  //res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id); //converts req.params to an int
  const getTask = db.prepare("SELECT * FROM tasks WHERE id = ?");
  // const id = tasks.find(task => task.id === parseInt(req.params.id)); //find the id from tasks, first
  if (!(getTask.get(id))) {
    res.status(404).json({"error": `task ${req.params.id} not found`});
  } else {
    res.json(getTask.get(id));
}});

app.post('/tasks', (req, res) => {
  const { title } = req.body;

  if (typeof title !== 'string' || title.trim() === "") {
      res.status(400).send("Title is missing.");
  }
  const postTask = db.prepare("INSERT INTO tasks (title, done) VALUES (?, ?)");
  postTask.run(title, 0);

  const getTask = db.prepare("SELECT * FROM tasks WHERE title = ?");
    
  res.status(201).json(getTask.get(title));}
);

app.put('/tasks/:id', (req, res) => {
  
  const id = parseInt(req.params.id);
  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
  let { title, done } = req.body;

  if (!task) {
    res.status(404).send("Task doesn't exist.");


  } else if (typeof title !== 'string' || title.trim() === "") {
      res.status(400).send("Title must be a string.");

  } else {
    const updateTask = db.prepare("UPDATE tasks SET title = ?, done = ? WHERE id = ?");

    if (typeof done === 'boolean') {
      if (done === true) {
        done = 1;
      } else {
        done = 0;
      } 

    updateTask.run(title, done, task.id);
    res.status(200);

    const getTasks = db.prepare("SELECT * FROM tasks WHERE id = ?");
    res.status(200).json(getTasks.get(id));
  }}
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = tasks.findIndex(t => t.id === parseInt(req.params.id));
  
  if (taskId === -1) {
    res.status(404).send("Task doesn't exist.");
  } else {
    const deleteTask = db.prepare("DELETE FROM tasks WHERE id = ?");
    deleteTask.run(taskId);
    //const task = tasks.splice(taskId, 1);
    const deleteDone = db.prepare("DELETE FROM tasks WHERE done = ?");
    deleteDone.run(1);
    res.status(204).json(taskId);
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//db.close();