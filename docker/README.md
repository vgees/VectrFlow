# Flowise Docker Hub Image

Starts Flowise from [DockerHub Image](https://hub.docker.com/repository/docker/flowiseai/flowise/general)

## Usage

1. Create `.env` file and specify the `PORT` (refer to `.env.example`)
2. `docker-compose up -d`
3. Open [http://localhost:8080](http://localhost:8080)
4. You can bring the containers down by `docker-compose stop`

## 🔒 Authentication

1. Create `.env` file and specify the `PORT`, `Vectrflow_USERNAME`, and `Vectrflow_PASSWORD` (refer to `.env.example`)
2. Pass `Vectrflow_USERNAME` and `Vectrflow_PASSWORD` to the `docker-compose.yml` file:
    ```
    environment:
        - PORT=${PORT}
        - Vectrflow_USERNAME=${Vectrflow_USERNAME}
        - Vectrflow_PASSWORD=${Vectrflow_PASSWORD}
    ```
3. `docker-compose up -d`
4. Open [http://localhost:3000](http://localhost:3000)
5. You can bring the containers down by `docker-compose stop`

## 🌱 Env Variables

If you like to persist your data (flows, logs, apikeys, credentials), set these variables in the `.env` file inside `docker` folder:

-   DATABASE_PATH=/root/.flowise
-   APIKEY_PATH=/root/.flowise
-   LOG_PATH=/root/.flowise/logs
-   SECRETKEY_PATH=/root/.flowise


