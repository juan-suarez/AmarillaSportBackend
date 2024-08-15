# Amarilla Sport Backend 

## Description

- **Infraestructure :** Api working with a nestjs server and postgresSQL data base both running in docker, the db handler is TypeORM, testing with jest and cookies injection, midelwares and jwt tokens for authorization. 
- **Code Architecture :** code workflow follows the hexagonal architecture, using the domain layout for db manipulation and entities, application for adapters and use-cases, and infraestructure for controllers, auth and midelware logic. Railway Oriented Programming (ROP) for error handling,The application continues its entire flow even if there are errors in the domain layer.

## App Init

### Instalation
```bash
$ npm install
```

## Building the app

```bash
# build docker and server
$ npm run build-app
```

## Running the app

```bash
# development
$ npm run start-app
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
## 

### Db model
![image](https://github.com/user-attachments/assets/47e0d7d4-b42d-4acd-a968-6c7d1065c3f5)
https://dbdiagram.io/d/amarilla-datbase-model-66bac70e8b4bb5230eefc53e

##

for testing build and init the app, you can use this `json postman collection`
