/* =====================================================
   TESTE DA API REST - executar com: npm test
   Sobe o servidor numa porta livre, testa as 5 operações
   e restaura o data/clientes.json original no final.
===================================================== */

const fs = require("fs");
const path = require("path");
const assert = require("assert");

const arquivo = path.join(__dirname, "../data/clientes.json");
const backup = fs.readFileSync(arquivo, "utf-8");

const app = require("../app");

async function main() {
    const server = app.listen(0);
    const base = `http://localhost:${server.address().port}/api/clientes`;
    const req = async (url, opcoes = {}) => {
        const r = await fetch(url, {
            headers: { "Content-Type": "application/json" },
            ...opcoes
        });
        return { status: r.status, body: await r.json() };
    };

    let ok = 0;
    const teste = async (nome, fn) => {
        await fn();
        ok++;
        console.log("✔", nome);
    };

    try {
        let id;

        await teste("Listar (GET /api/clientes)", async () => {
            const r = await req(base);
            assert.strictEqual(r.status, 200);
            assert.ok(Array.isArray(r.body));
        });

        await teste("Cadastrar (POST /api/clientes) -> 201", async () => {
            const r = await req(base, {
                method: "POST",
                body: JSON.stringify({ nome: "  Teste da Silva ", email: "TESTE@Email.com" })
            });
            assert.strictEqual(r.status, 201);
            assert.deepStrictEqual(Object.keys(r.body).sort(), ["email", "id", "nome"]);
            assert.strictEqual(r.body.nome, "Teste da Silva");
            assert.strictEqual(r.body.email, "teste@email.com");
            id = r.body.id;
        });

        await teste("Cadastrar sem nome/email inválido -> 400", async () => {
            const r = await req(base, { method: "POST", body: JSON.stringify({ email: "x" }) });
            assert.strictEqual(r.status, 400);
            assert.strictEqual(r.body.erros.length, 2);
        });

        await teste("Cadastrar e-mail duplicado -> 400", async () => {
            const r = await req(base, {
                method: "POST",
                body: JSON.stringify({ nome: "Outro", email: "teste@email.com" })
            });
            assert.strictEqual(r.status, 400);
        });

        await teste("JSON malformado -> 400", async () => {
            const r = await req(base, { method: "POST", body: "{nome:" });
            assert.strictEqual(r.status, 400);
        });

        await teste("Consultar (GET /api/clientes/:id)", async () => {
            const r = await req(`${base}/${id}`);
            assert.strictEqual(r.status, 200);
            assert.strictEqual(r.body.id, id);
        });

        await teste("Consultar inexistente -> 404", async () => {
            const r = await req(`${base}/999999`);
            assert.strictEqual(r.status, 404);
        });

        await teste("Alterar (PUT /api/clientes/:id)", async () => {
            const r = await req(`${base}/${id}`, {
                method: "PUT",
                body: JSON.stringify({ nome: "Teste Alterado", email: "teste@email.com" })
            });
            assert.strictEqual(r.status, 200);
            assert.strictEqual(r.body.nome, "Teste Alterado");
        });

        await teste("Alterar inexistente -> 404", async () => {
            const r = await req(`${base}/999999`, {
                method: "PUT",
                body: JSON.stringify({ nome: "Fulano", email: "f@f.com" })
            });
            assert.strictEqual(r.status, 404);
        });

        await teste("Excluir (DELETE /api/clientes/:id)", async () => {
            const r = await req(`${base}/${id}`, { method: "DELETE" });
            assert.strictEqual(r.status, 200);
            const r2 = await req(`${base}/${id}`);
            assert.strictEqual(r2.status, 404);
        });

        await teste("Excluir inexistente -> 404", async () => {
            const r = await req(`${base}/${id}`, { method: "DELETE" });
            assert.strictEqual(r.status, 404);
        });

        console.log(`\n${ok} testes passaram.`);
    } catch (erro) {
        console.error("✘ Falhou:", erro.message);
        process.exitCode = 1;
    } finally {
        fs.writeFileSync(arquivo, backup);
        server.close();
    }
}

main();
