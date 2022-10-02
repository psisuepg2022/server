# ***P***atient & ***S***cheduling ***I***nformation ***S***ystem

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=PSIS&uri=https%3A%2F%2Fgithub.com%2Fpsisuepg2022%2Fserver%2Fblob%2Fmaster%2Fdocs%2FInsomnia%2Fworkspace.json)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://psis-api.herokuapp.com)

# Sobre

Engenharia de Computação, UEPG - 7º período

Projeto realizado para disciplina Projeto de Software

[Marcos Renan Krul](https://github.com/MarcosKrul) - [Renato Cristiano Ruppel](https://github.com/HERuppel)

# Guia para instalação

## Dependências

* [Node.JS versão 16.15.1](https://nodejs.org/dist/v16.15.1/)
* [PostgreSQL versão 14.1](https://www.postgresql.org/about/news/postgresql-141-135-129-1114-1019-and-9624-released-2349/)
* [Yarn versão 1.22.17](https://www.npmjs.com/package/yarn/v/1.22.17)

## Rodar a API localmente

* Abrir um terminal na pasta do projeto
* Instalar as dependências com:

```
    yarn
```

* Criar o arquivo **.env.development** na raíz da API
* Copiar as variáveis de ambiente o arquivo **.env.example**
* Completar as variáveis com os valores locais desejados (para o local **não** é necessário informar **SHADOW_DATABASE_URL**)
* Formato da ***connection string*** do banco

```
    postgres://USER:PASSWORD@HOST:PORT/DB_NAME
```

* Criar o banco de dados:

```
    yarn prisma:migrate:dev
```

* Iniciar o servidor:

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
    --url http://localhost:<PORT>/api/owner/<SUPPORT_ID> \
    --header 'Content-Type: application/json' \
    --data '{
    "userName": "",
    "password": "",
    "name": "",
    "CPF": "ddd.ddd.ddd-dd",
    "birthDate": "yyyy-MM-dd",
    "clinicId": "ID DA CLÍNICA CRIADA ANTERIORMENTE"
    }'
```
