const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

const conexion = mysql.createConnection({
  host: "localhost",
  user: "appuser",
  password: "1234",
  database: "camara"
});

conexion.connect(err => {
  if (err) {
    console.error("Error DB:", err.message);
  } else {
    console.log("Conectado a MariaDB");
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/guardar", (req, res) => {
  const { texto, imagen } = req.body;

  const sql = "INSERT INTO fotos (texto, imagen) VALUES (?, ?)";
  conexion.query(sql, [texto, imagen], err => {
    if (err) {
      res.status(500).send("Error al guardar");
    } else {
      res.send("Foto y texto guardados correctamente!");
    }
  });
});

app.get("/fotos", (req, res) => {
  const sql = "SELECT id, texto, imagen FROM fotos ORDER BY id DESC";
  conexion.query(sql, (err, resultados) => {
    if (err) {
      res.status(500).json({ error: "Error al obtener fotos" });
    } else {
      res.json(resultados);
    }
  });
});

// Ruta para borrar una foto
app.delete("/borrar/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM fotos WHERE id = ?";
  conexion.query(sql, [id], (err) => {
    if (err) res.status(500).send("Error al borrar");
    else res.send("Eliminado correctamente");
  });
});

// Ruta para editar el texto
app.put("/editar/:id", (req, res) => {
  const { id } = req.params;
  const { texto } = req.body;
  const sql = "UPDATE fotos SET texto = ? WHERE id = ?";
  conexion.query(sql, [texto, id], (err) => {
    if (err) res.status(500).send("Error al actualizar");
    else res.send("Actualizado correctamente");
  });
});

app.listen(3000, () => {
  console.log("Servidor activo en http://localhost:3000");
});
