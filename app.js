const express = require("express");
const path = require("path");
const cors = require("cors");

const model = require("./models/clienteModel");

const app = express();

// O Render fica atrás de um proxy HTTPS
app.set("trust proxy", 1);

// CORS - permite acesso à API pelo Expo Snack (web e celular)
app.use(cors());

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// FORM e JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROTAS
const clienteRoutes = require("./routes/clienteRoutes");
const clienteApiRoutes = require("./routes/clienteApiRoutes");

app.use("/clientes", clienteRoutes);     // telas (CRUD pelo navegador)
app.use("/api/clientes", clienteApiRoutes); // API REST (JSON)

// INDEX PRINCIPAL
app.get("/", (req, res) => {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    res.render("index", {
        titulo: "CRUD de Clientes",
        baseUrl,
        armazenamento: model.armazenamento
    });
});

// Status da API (útil para "acordar" o Render)
app.get("/api", (req, res) => {
    res.json({
        status: "online",
        armazenamento: model.armazenamento,
        rotas: {
            listar: "GET /api/clientes",
            consultar: "GET /api/clientes/:id",
            cadastrar: "POST /api/clientes",
            alterar: "PUT /api/clientes/:id",
            excluir: "DELETE /api/clientes/:id"
        }
    });
});

// JSON inválido no corpo da requisição
app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ erro: "JSON inválido no corpo da requisição." });
    }
    console.error(err);
    if (req.path.startsWith("/api")) {
        return res.status(500).json({ erro: "Erro interno do servidor." });
    }
    res.status(500).send("Erro interno do servidor.");
});

// 404
app.use((req, res) => {
    if (req.path.startsWith("/api")) {
        return res.status(404).json({ erro: "Rota não encontrada." });
    }
    res.redirect("/");
});

// SERVER
const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT} (armazenamento: ${model.armazenamento})`);
    });
}

module.exports = app;
