/* =====================================================
   CONTROLLER - API REST DE CLIENTES (JSON)
   Consumido pelo app React Native (Expo Snack)
===================================================== */

const model = require("../models/clienteModel");

/* LISTAR - GET /api/clientes */
exports.listar = async (req, res) => {
    try {
        const clientes = await model.listar();
        res.json(clientes);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao listar clientes." });
    }
};

/* CONSULTAR - GET /api/clientes/:id */
exports.consultar = async (req, res) => {
    try {
        const cliente = await model.buscarPorId(req.params.id);
        if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado." });
        res.json(cliente);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao consultar cliente." });
    }
};

/* CADASTRAR - POST /api/clientes */
exports.cadastrar = async (req, res) => {
    try {
        const dados = model.normalizar(req.body);
        const erros = await model.validar(dados);
        if (erros.length) return res.status(400).json({ erro: erros.join(" "), erros });

        const novo = await model.salvar(dados);
        res.status(201).json(novo);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao cadastrar cliente." });
    }
};

/* ALTERAR - PUT /api/clientes/:id */
exports.alterar = async (req, res) => {
    try {
        const existente = await model.buscarPorId(req.params.id);
        if (!existente) return res.status(404).json({ erro: "Cliente não encontrado." });

        const dados = model.normalizar(req.body);
        const erros = await model.validar(dados, req.params.id);
        if (erros.length) return res.status(400).json({ erro: erros.join(" "), erros });

        const atualizado = await model.editar(req.params.id, dados);
        res.json(atualizado);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao alterar cliente." });
    }
};

/* EXCLUIR - DELETE /api/clientes/:id */
exports.excluir = async (req, res) => {
    try {
        const removido = await model.excluir(req.params.id);
        if (!removido) return res.status(404).json({ erro: "Cliente não encontrado." });
        res.json({ mensagem: "Cliente excluído com sucesso." });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao excluir cliente." });
    }
};
