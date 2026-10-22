/* =====================================================
   CONTROLLER - TELAS (EJS) DE CLIENTES
===================================================== */

const model = require("../models/clienteModel");

/* LISTAR (tela) */
exports.index = async (req, res) => {
    const clientes = await model.listar();
    res.render("clientes/index", {
        clientes,
        clienteEditar: null,
        erros: [],
        form: {}
    });
};

/* SALVAR NOVO CLIENTE */
exports.salvar = async (req, res) => {
    const dados = model.normalizar(req.body);
    const erros = await model.validar(dados);

    if (erros.length) {
        const clientes = await model.listar();
        return res.status(400).render("clientes/index", {
            clientes,
            clienteEditar: null,
            erros,
            form: dados
        });
    }

    await model.salvar(dados);
    res.redirect("/clientes");
};

/* FORM EDITAR */
exports.formEditar = async (req, res) => {
    const clienteEditar = await model.buscarPorId(req.params.id);
    if (!clienteEditar) return res.redirect("/clientes");

    const clientes = await model.listar();
    res.render("clientes/index", {
        clientes,
        clienteEditar,
        erros: [],
        form: clienteEditar
    });
};

/* EDITAR */
exports.editar = async (req, res) => {
    const clienteEditar = await model.buscarPorId(req.params.id);
    if (!clienteEditar) return res.redirect("/clientes");

    const dados = model.normalizar(req.body);
    const erros = await model.validar(dados, req.params.id);

    if (erros.length) {
        const clientes = await model.listar();
        return res.status(400).render("clientes/index", {
            clientes,
            clienteEditar,
            erros,
            form: dados
        });
    }

    await model.editar(req.params.id, dados);
    res.redirect("/clientes");
};

/* EXCLUIR */
exports.excluir = async (req, res) => {
    await model.excluir(req.params.id);
    res.redirect("/clientes");
};

/* API simples (mesmo formato do tutorial: /clientes/api) */
exports.api = async (req, res) => {
    try {
        res.json(await model.listar());
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao buscar clientes." });
    }
};
