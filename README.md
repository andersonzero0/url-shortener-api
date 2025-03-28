<p align="center"><h1 align="center">URL Shortener API</h1></p>
<p align="center">
	<em><code>NestJS | PostgresSQL | Prisma | Docker</code></em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/andersonzero0/url-shortener-api?style=default&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/andersonzero0/url-shortener-api?style=default&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/andersonzero0/url-shortener-api?style=default&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/andersonzero0/url-shortener-api?style=default&color=0080ff" alt="repo-language-count">
</p>
<br>

### Deploy - Acessar API

[https://url-shortener-api-gilt.vercel.app/reference](https://url-shortener-api-gilt.vercel.app/reference)

### O projeto contém..

- **Docker Compose**
- **Jest**
- **Pré-commit (Husky)**
- **Documentação (Swagger)**
- **Validação de campos com `class-validator` e `class-transformer`**
- **GitHub Actions (Lint e Testes)**

### Funcionalidades novas adicionadas

- **Expiração da URL encurtada**

### Pré-requisitos

- **Liguagem:** TypeScript
- **Gerenciador de pacotes:** Yarn, Npm
- **Container Runtime:** Docker

### Rodar aplicação através do Docker Compose

1. Clonar repositório

```env
git clone https://github.com/andersonzero0/url-shortener-api
```

2. Navegar ao diretorio do projeto

```sh
❯ cd url-shortener-api
```

3. Renomear o arquivo `.env.example` para `.env`

   ```sh
   # .env.example

   PORT=3000

   BASE_URL=http://localhost:3000 # Definir o dominio da API, usada criar o shortUrl

   JWT_SECRET=secret

   DATABASE_URL="postgresql://postgres:supersecret@db:5432/url_shortener_db?schema=public"
   ```

   - Unix

   ```sh
   ❯ mv .env.example .env
   ```

   - CMD (Windows)

   ```sh
   ❯ rename .env.example .env
   ```

   - Powershell (Windows)

   ```sh
   ❯ Rename-Item .env.example .env
   ```

4. Executar Docker Compose

```sh
❯ docker compose up -d
```

5. Acessar documentação | Swagger (Open API)
   [http://localhost:3000/reference](http://localhost:3000/reference)

### Teste unitários

1. Rodar testes

   - NPM

   ```sh
   ❯ npm install
   ❯ npm run test
   ```

   - Yarn

   ```sh
   ❯ yarn
   ❯ yarn test
   ```

### Melhorias para escalar horizontalmente

- **IDs Únicos Distribuídos:** UUID v7 (A API está usando essa versão do UUID atualmente)
- **Cache Distribuído:** Redis ou Memcached
- **Processamento Assíncrono:** Usar filas (Kafka, RabbitMQ) para atualizar a contagem de cliques.

#### Desafios:

- Geração de Short Codes Únicos
- Balanceamento de Carga
