const express = require("express"); 
const mysql = require("mysql2"); 
const path = require("path"); 

const app = express(); 

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "exemplo_db",
});

// ---------- ROTAS ----------

// GET /usuarios → retorna todos os usuários (com id, nome e email)
app.get("/usuarios", (req, res) => {
  db.query("SELECT id, nome, email FROM usuarios", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// POST /usuarios → adiciona um novo usuário
app.post("/usuarios", (req, res) => {
  const { nome, email } = req.body;
  db.query(
    "INSERT INTO usuarios (nome, email) VALUES (?, ?)",
    [nome, email],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Usuário adicionado com sucesso!" });
    }
  );
});

// DELETE /usuarios/:id → remove o usuário pelo id
app.delete("/usuarios/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM usuarios WHERE id = ?", [id], (err, result) => {
    if (err) throw err;
    res.json({ message: "Usuário removido com sucesso!" });
  });
});

app.listen(3000, () =>
  console.log("Servidor rodando em http://localhost:3000")
);