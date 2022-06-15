# Budget API

Backend service for https://github.com/Marcus-Rise/budget

## Requirements

- `yarn`

## Preparation

- Copy `.env.example` as `.env`

## Local dev

In project root folder

- Up services
```shell
docker-compose -f docker-compose.local.yml up -d
```

- Watch `http://localhost:8080` db browser

In `app` folder

- Install dependencies
```shell
yarn install
```

- Copy `.env.example` as `.env`

- Generate orm config
```shell
yarn typeorm:config
```

- Run local dev server
```shell
yarn start:dev
```

## Local demo

In `app` folder

- Install dependencies
```shell
yarn install
```

- Build app
```shell
yarn build
```

- In project root folder Up
```shell
docker-compose -f docker-compose.demo.yml up -d
```

- Watch `https://localhost` app
- Watch `https://localhost/adminer` db browser
