const express = require("express");
const app = express();
const fs = require("fs");
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// armazenamento das tarefas
let tasks = [];
let idCounter = 1;

//inicia o json
if (fs.existsSync("tasks.json")) {
  const data = fs.readFileSync("tasks.json", "utf-8");
  tasks = JSON.parse(data);
}



// LISTAR tarefas
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// ADICIONAR tarefa
app.post("/tasks", (req, res) => {
  const { text, color } = req.body;

  const newTask = {
    id: idCounter,
    text: text,
    done: false,
    color: color || "#7873f5" // cor padrão caso não venha
  };

  tasks.push(newTask);
  idCounter++;
  saveTasks();

  res.status(201).json(newTask);
});
// CONCLUIR / DESMARCAR tarefa
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ message: "Tarefa não encontrada" });
  }
task.done = !task.done;
saveTasks();
  res.json(task);
});

// EXCLUIR tarefa
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  tasks = tasks.filter(t => t.id !== id);
    saveTasks();
  res.json({ message: "Tarefa removida" });
});
//parte do json
function saveTasks() {
  fs.writeFileSync("tasks.json", JSON.stringify(tasks, null, 2));
}







// INICIAR servidor
app.listen(PORT, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
