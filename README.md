# CRUD de Clientes — Node.js + Express (MVC) + API REST + Expo Snack

Aplicação em **Node.js + Express** no padrão **MVC** que faz o CRUD de **Clientes** (campos `id`, `nome`, `email`) e disponibiliza uma **API REST** consumida por um aplicativo **React Native** no **Expo Snack**.

- Node.js = servidor/API (publicado no Render)
- React Native (Expo Snack) = aplicativo que consome a API

## Entrega

| Item | URL |
|---|---|
| GitHub | https://github.com/Davimpaulino/AtividadeIA |
| API no Render | (https://atividadeia-it6z.onrender.com)` |
| Expo Snack | (https://snack.expo.dev/@davimpaulino/atividadeia) |

## Estrutura (MVC)

```
app.js                          # servidor Express, CORS, rotas
config/firebase.js              # Firebase opcional (via variáveis de ambiente)
models/clienteModel.js          # Model: acesso aos dados + validação
controllers/clienteController.js     # Controller das telas (EJS)
controllers/clienteApiController.js  # Controller da API REST (JSON)
routes/clienteRoutes.js         # rotas das telas  -> /clientes
routes/clienteApiRoutes.js      # rotas da API     -> /api/clientes
views/                          # Views EJS + Bootstrap
data/clientes.json              # "banco" em arquivo JSON

```

## API REST

| Operação | Método | Rota | Resposta |
|---|---|---|---|
| Listar | GET | `/api/clientes` | 200 + lista |
| Consultar | GET | `/api/clientes/:id` | 200 ou 404 |
| Cadastrar | POST | `/api/clientes` | 201 ou 400 |
| Alterar | PUT | `/api/clientes/:id` | 200, 400 ou 404 |
| Excluir | DELETE | `/api/clientes/:id` | 200 ou 404 |

Corpo JSON para cadastrar/alterar:

```json
{ "nome": "Maria Silva", "email": "maria@email.com" }
```

Validações: nome obrigatório (mín. 3 caracteres), e-mail obrigatório, em formato válido e sem repetir.

Também existe `GET /clientes/api` (mesmo formato do tutorial) e `GET /api` (status da API).

## Rodando localmente

```bash
npm install
npm run dev        # ou: npm start
npm test           # testa as 5 operações da API
```

Acesse http://localhost:3000 (telas) e http://localhost:3000/api/clientes (JSON).

## Deploy no Render

1. Em https://render.com → **New → Web Service** → conecte este repositório.
2. **Language:** Node · **Build Command:** `npm install` · **Start Command:** `npm start` · **Plan:** Free.
3. Clique em **Deploy** e teste `https://SEU-PROJETO.onrender.com/api/clientes` no navegador.

> Armazenamento: por padrão os dados ficam em `data/clientes.json`. No plano gratuito do Render o disco é temporário, então cadastros feitos pela API voltam ao estado inicial quando o serviço reinicia.
> Para dados permanentes, use o Firebase: defina no Render as variáveis `FIREBASE_SERVICE_ACCOUNT` (JSON da conta de serviço) e `FIREBASE_DATABASE_URL` (URL do Realtime Database). Com elas definidas, a aplicação usa o Firebase automaticamente.

## Expo Snack

1. Abra https://snack.expo.dev.
2. Cole o conteúdo de `expo/App.js` no `App.js` do Snack.
3. Troque `SEU-PROJETO` na constante `API_URL` pela URL do Render.
4. O app lista os clientes da API e também permite cadastrar, editar e excluir.

## Tecnologias

Node.js · Express 5 · EJS · Bootstrap 5 · CORS · React Native (Expo Snack) · Render
