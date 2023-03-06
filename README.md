# ***P***atient & ***S***cheduling ***I***nformation ***S***ystem

- [Deploy API](https://api.psis.net.br)
- [Deploy client](https://psis.net.br) ([Repositório](https://github.com/psisuepg2022/client))

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=PSIS&uri=https%3A%2F%2Fgithub.com%2Fpsisuepg2022%2Fserver%2Fblob%2Fmaster%2Fdocs%2FInsomnia%2Fworkspace.json)

# Sobre

Engenharia de Computação, UEPG - 7º período

Projeto realizado para disciplina Projeto de Software

[Marcos Renan Krul](https://github.com/MarcosKrul) - [Renato Cristiano Ruppel](https://github.com/HERuppel)

# Guia para instalação

## Dependências

- [Node.JS versão 16.15.1](https://nodejs.org/dist/v16.15.1/)
- [PostgreSQL versão 14.1](https://www.postgresql.org/about/news/postgresql-141-135-129-1114-1019-and-9624-released-2349/)
- [Yarn versão 1.22.17](https://www.npmjs.com/package/yarn/v/1.22.17)

## Rodar a API localmente

```
    mkdir server && cd server
    git clone https://github.com/psisuepg2022/server.git .
    yarn
```

- Criar o arquivo **.env.development** na raíz da API
- Copiar as variáveis de ambiente do arquivo **.env.example**
- Completar as variáveis com os valores locais desejados (para o local **não** é necessário informar **SHADOW_DATABASE_URL**)

```
    cp .env.example .env.development
```

- Formato da **_connection string_** do banco

```
    postgres://USER:PASSWORD@HOST:PORT/DB_NAME
```

- Criar o banco de dados

```
    yarn prisma:migrate:dev
```

- Iniciar o servidor

```
    yarn dev:server
```

# Script para criação da clínica

```
    curl --request POST \
    --url http://localhost:<PORT>/api/clinic/<SUPPORT_ID> \
    --header 'Content-Type: application/json' \
    --data '{
    "name": "",
    "email": ""
    }'
```

# Script para criação do proprietário

```
    curl --request POST \
    --url http://localhost:<PORT>/api/owner/<SUPPORT_ID>/<CLINIC_ID> \
    --header 'Content-Type: application/json' \
    --data '{
    "userName": "",
    "password": "",
    "name": "",
    "CPF": "ddd.ddd.ddd-dd",
    "birthDate": "yyyy-MM-dd",
    "contactNumber": "(dd) ddddd-dddd"
    }'
```
