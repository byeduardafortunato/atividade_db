const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Ajuste conforme seu banco (XAMPP padrão)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "exemplo_db",
});

// --- Rotas ---

// GET /usuarios -> retorna todos os usuários (id, nome, email)
app.get("/usuarios", (req, res) => {
  db.query("SELECT id, nome, email FROM usuarios", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro no banco" });
    }
    res.json(results);
  });
});

// POST /usuarios -> cadastra novo usuário
app.post("/usuarios", (req, res) => {
  const { nome, email } = req.body;
  if (!nome || !email) return res.status(400).json({ error: "Campos obrigatórios" });

  db.query(
    "INSERT INTO usuarios (nome, email) VALUES (?, ?)",
    [nome, email],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao inserir" });
      }
      res.status(201).json({ message: "Usuário adicionado com sucesso!", id: result.insertId });
    }
  );
});

// DELETE /usuarios/:id -> remove usuário pelo id
app.delete("/usuarios/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM usuarios WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao deletar" });
    }
    res.json({ message: "Usuário removido com sucesso!" });
  });
});

// --- Novas rotas ---

// POST /login -> busca por email e retorna info (se encontrar)
app.post("/login", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email é obrigatório" });

  db.query("SELECT id, nome, email FROM usuarios WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro no banco" });
    }
    if (results.length === 0) {
      return res.status(404).json({ found: false, message: "Usuário inexistente" });
    }
    res.json({ found: true, user: results[0] });
  });
});

// GET /total -> retorna o total de usuários
app.get("/total", (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM usuarios", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro no banco" });
    }
    res.json({ total: results[0].total });
  });
});

// Inicia servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:3000`));