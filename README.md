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

## for local testing
1. build and start the app
2. create a customer with `@POST localhost:3000/auth/sign-up` endpoint
3. login in `@GET localhost:3000/auth/login`
4. now you can use the other endpoints, no need auth data in request, all is handled with cookies. login session expires in 1 hour.

use this  [json postamn collection](https://github.com/juan-suarez/AmarillaSportBackend/blob/main/AmarillaSport.postman_collection.json)
