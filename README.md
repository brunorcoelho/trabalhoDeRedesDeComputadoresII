# Trabalho de Redes de Computadores II – Marketplace Demo

Disciplina: Redes de Computadores II
Curso: Ciência da Computação
Docente: Roberto Benedito De Oliveira Pereira
Grupo de Discentes: Bruno Coelho, Caio Guilherme, Fernando Zanette & Giovani Gabriel

Aplicação web simples (Node.js + Express + PostgreSQL + React) para cadastro de usuários em um marketplace. Inclui:

- API REST para registro de usuários (`/api/register`) e listagem (`/api/users`).
- Hash de senha com `bcrypt`.
- Criação automática da tabela `users` no início.
- Frontend React com formulário estilizado e tabela de usuários recentes.
- Execução totalmente containerizada com Docker Compose.

## Tecnologias

- Node.js / Express
- PostgreSQL (imagem oficial `postgres:14-alpine`)
- React 18 + esbuild (bundle rápido)
- Docker / Docker Compose

## Estrutura

```
├── Dockerfile
├── docker-compose.yml
├── main.js                # Servidor Express + rotas API + schema
├── public/                # Arquivos estáticos servidos pelo Express
│   ├── index.html
│   ├── styles.css
│   ├── dist/bundle.js     # Gerado pelo build do frontend
│   └── src/index.jsx      # Código React (origem)
├── package.json
├── .env.example           # Modelo de variáveis de ambiente
└── README.md
```

## Variáveis de Ambiente

Copie `.env.example` para `.env` (o Docker já lê `.env` via `env_file`).

```
DB_HOST=db
DB_USER=user_desafio
DB_PASSWORD=senha_forte_123
DB_NAME=desafio_db
```

Esses valores precisam bater com os do serviço `db` no `docker-compose.yml`.

## Como Rodar em uma Máquina Nova (Passo a Passo)

Pré-requisitos: Docker e Docker Compose instalados.

1. Clone o repositório:
	```bash
	git clone https://github.com/brunorcoelho/trabalhoDeRedesDeComputadoresII.git
	cd trabalhoDeRedesDeComputadoresII
	```
2. Crie o arquivo `.env` baseado no exemplo:
	```bash
	cp .env.example .env
	```
3. Suba os containers (build automático):
	```bash
	docker compose up --build -d
	```
4. Verifique se os serviços estão de pé:
	```bash
	docker compose ps
	```
5. Acesse o frontend: http://localhost:3000
6. Cadastre um usuário pelo formulário. Deverá aparecer mensagem de sucesso e a tabela “Usuários Recentes” será atualizada.

## Rodar Queries no Banco

Via container:
```bash
docker compose exec db psql -U user_desafio -d desafio_db -c "SELECT id, name, email, created_at FROM users;"
```

Para usar pgAdmin, exponha a porta 5432 (já exposta se você adicionar em `db`):
```yaml
  db:
	 ports:
		- "5432:5432"
```
Depois conecte com host `localhost`, usuário `user_desafio`.

## Fluxo da API

### Registrar Usuário
`POST /api/register`
```json
{
  "name": "João",
  "email": "joao@example.com",
  "password": "segredo123"
}
```
Resposta (200):
```json
{
  "ok": true,
  "user": { "id": 1, "name": "João", "email": "joao@example.com", "created_at": "2025-08-17T21:58:58.857Z" }
}
```

### Listar Usuários
`GET /api/users` -> retorna até 100 usuários mais recentes.

## Limpeza / Reset
Apagar containers e volume (apaga dados!):
```bash
docker compose down -v
```
