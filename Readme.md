
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
![Screenshot 2024-03-18 at 11 52 31 PM](https://github.com/Hussainzz/Multi-Asset-Wallet/assets/13753141/321b5899-961f-4b80-8dbf-571dcffe6d07)


## Swagger Doc

http://localhost:8002/docs

Test API Key (Make sure db is seeded)
```
Headers
wallet-x-key: test-jim-api-key
```
![multi-asset](https://github.com/Hussainzz/Multi-Asset-Wallet/assets/13753141/a08b6cc7-825f-4246-bb56-97f8820abddd)

## Bull Queue Board
http://localhost:8002/admin/queues

![image](https://github.com/Hussainzz/Multi-Asset-Wallet/assets/13753141/6580a6db-b9eb-4c45-87d1-f7c67bd3ba62)

![image](https://github.com/Hussainzz/Multi-Asset-Wallet/assets/13753141/ffe35501-5d9e-4e02-8855-6818c4e9bace)

