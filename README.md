<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# Execute on dev

1. Clone the repo
2. Execute 
```
npm i or npm install
```
3. You have to need Nest CLI installed
```
npm i -g @nest/cli
```
4. Up database
```
docker-compose up -d
```

5. Clone the file __.env.template__ and rename the copy to __.env__

6. fill the environment variables defined in the ```.env``` 
7. Execute the app in dev:

``` 
npm run start:dev
```

8. Rebuild database with the seed

```
localhost:3000/api/v2/seed
```

## Stack used
* Mongodb
* Nest