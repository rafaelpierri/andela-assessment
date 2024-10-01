# Andela\'s ecommerce platform

## Description

Inventory Management API repository.

## Running the API

```bash
$ docker-compose up -d
```

API docs may be found at [http://localhost:4000/api](http://localhost:4000/api).

## Project setup

```bash
$ npm install
$ docker-compose up -d postgres
$ npm run migration:run
```

## Compile and run the project

The following commands will make the API available at [http://localhost:3000](http://localhost:3000).

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# automated tests
$ npm run test
```
