/* =====================================================
   MODEL - CLIENTES
   Campos: id, nome, email

   Armazenamento:
   - Firebase Realtime Database, se configurado (config/firebase.js)
   - Caso contrário, arquivo JSON em data/clientes.json
===================================================== */

const fs = require("fs");
const path = require("path");
const db = require("../config/firebase");

const caminho = path.join(__dirname, "../data/clientes.json");

/* =====================================================
   ARMAZENAMENTO EM ARQUIVO JSON
===================================================== */
const jsonStore = {
    lerDados() {
        if (!fs.existsSync(caminho)) return [];
        const conteudo = fs.readFileSync(caminho, "utf-8").trim();
        return conteudo ? JSON.parse(conteudo) : [];
    },

    salvarDados(dados) {
        fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
    },

    async listar() {
        return this.lerDados();
    },

    async buscarPorId(id) {
        return this.lerDados().find(c => String(c.id) === String(id)) || null;
    },

    async salvar(cliente) {
        const clientes = this.lerDados();
        // ID automático: maior id existente + 1
        const novoId = clientes.reduce((max, c) => Math.max(max, Number(c.id) || 0), 0) + 1;
        const novo = { id: novoId, nome: cliente.nome, email: cliente.email };
        clientes.push(novo);
        this.salvarDados(clientes);
        return novo;
    },

    async editar(id, dados) {
        const clientes = this.lerDados();
        const index = clientes.findIndex(c => String(c.id) === String(id));
        if (index === -1) return null;
        clientes[index] = { ...clientes[index], nome: dados.nome, email: dados.email };
        this.salvarDados(clientes);
        return clientes[index];
    },

    async excluir(id) {
        const clientes = this.lerDados();
        const restantes = clientes.filter(c => String(c.id) !== String(id));
        if (restantes.length === clientes.length) return false;
        this.salvarDados(restantes);
        return true;
    }
};

/* =====================================================
   ARMAZENAMENTO NO FIREBASE (mesma interface)
===================================================== */
function criarFirebaseStore(database) {
    const ref = database.ref("clientes");

    return {
        async listar() {
            const snap = await ref.once("value");
            const dados = snap.val();
            if (!dados) return [];
            return Object.keys(dados).map(id => ({
                id,
                nome: dados[id].nome,
                email: dados[id].email
            }));
        },

        async buscarPorId(id) {
            const snap = await ref.child(id).once("value");
            if (!snap.exists()) return null;
            return { id, ...snap.val() };
        },

        async salvar(cliente) {
            const novaRef = ref.push();
            const dados = { nome: cliente.nome, email: cliente.email };
            await novaRef.set(dados);
            return { id: novaRef.key, ...dados };
        },

        async editar(id, dados) {
            const snap = await ref.child(id).once("value");
            if (!snap.exists()) return null;
            await ref.child(id).update({ nome: dados.nome, email: dados.email });
            return { id, nome: dados.nome, email: dados.email };
        },

        async excluir(id) {
            const snap = await ref.child(id).once("value");
            if (!snap.exists()) return false;
            await ref.child(id).remove();
            return true;
        }
    };
}

const store = db ? criarFirebaseStore(db) : jsonStore;

/* =====================================================
   VALIDAÇÃO
===================================================== */
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizar(dados = {}) {
    return {
        nome: String(dados.nome ?? "").trim(),
        email: String(dados.email ?? "").trim().toLowerCase()
    };
}

/**
 * Valida nome e e-mail. Retorna uma lista de mensagens de erro
 * (vazia quando está tudo certo). idAtual é usado na alteração
 * para não acusar e-mail duplicado do próprio cliente.
 */
async function validar(dados, idAtual = null) {
    const erros = [];

    if (!dados.nome) erros.push("O nome é obrigatório.");
    else if (dados.nome.length < 3) erros.push("O nome deve ter pelo menos 3 caracteres.");

    if (!dados.email) erros.push("O e-mail é obrigatório.");
    else if (!REGEX_EMAIL.test(dados.email)) erros.push("Informe um e-mail válido.");
    else {
        const clientes = await store.listar();
        const duplicado = clientes.some(
            c => c.email === dados.email && String(c.id) !== String(idAtual)
        );
        if (duplicado) erros.push("Já existe um cliente com este e-mail.");
    }

    return erros;
}

module.exports = {
    armazenamento: db ? "firebase" : "json",
    listar: () => store.listar(),
    buscarPorId: id => store.buscarPorId(id),
    salvar: cliente => store.salvar(cliente),
    editar: (id, dados) => store.editar(id, dados),
    excluir: id => store.excluir(id),
    normalizar,
    validar
};
