
# **Multi-Asset Wallet**  💸
##### a  system where users can store balances for
different assets like cryptocurrency tokens (e.g., Bitcoin, Ethereum) and fiat currencies (e.g.,
USD, EUR).

### TechStack ⚒️
*NodeJS, ExpressJs, TypeScript, PrismaORM, MySQL, Redis, Bull Queue*


## ⏭️


### Populate .env
```
PORT=8002
NODE_ENV=development
DATABASE_URL=mysql://root:<password>@127.0.0.1/multiasset
```

```
// This will just spin up redis service
> docker-compose up -d
```

### Run App
```
> yarn db-init
> yarn dev
```

### Run Tests
```
// Unit
    yarn test

// e2e
    yarn test:all
```

## Swagger Doc


## Bull Queue Board

## Screenshots