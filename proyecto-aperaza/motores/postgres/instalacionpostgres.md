## 5. Paso 4: PostgreSQL

### 5.1 Crear docker-compose.yml

``` bash
cat > ~/ia-lab/services/motores-bd/postgres/docker-compose.yml << 'EOF'
services:
  postgres:
    image: postgres:16
    container_name: postgres-server
    restart: unless-stopped
    env_file:
      - .env
    ports:
      - "5433:5432"
    volumes:
      - ../../../data/postgres:/var/lib/postgresql/data
      - /mnt/c/academia/bd:/backups
    networks:
      - ia-lab-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 20s

networks:
  ia-lab-network:
    external: true
EOF
```

### 5.2 Crear .env

``` bash
cat > ~/ia-lab/services/motores-bd/postgres/.env << 'EOF'
TZ=America/Bogota
POSTGRES_DB=ImpulsaColectivo 
POSTGRES_USER=anthony
POSTGRES_PASSWORD=1234567
PGDATA=/var/lib/postgresql/data
EOF
```

### 5.3 Crear README.md

``` bash
cat > ~/ia-lab/services/motores-bd/postgres/README.md << 'EOF'
# PostgreSQL 17 - Motor de Base de Datos

> **Acceso remoto habilitado.** Puerto expuesto en `0.0.0.0:5433`.
> **Usuario por defecto:** `anthony` (acceso remoto: sin restriccion de host)
EOF
```
------------------------------------------------------------------------------

## Conectar desde WSL (local)

```bash
docker exec -it postgres-server psql -U anthony -d ImpulsaColectivo
# Password: 1234567
```

## Conectar remotamente desde cualquier equipo

``` bash
psql -h 172.21.51.153 -p 5433 -U anthony -d ImpulsaColectivo
```

O con cliente grafico (pgAdmin, DBeaver): - **Host:** `172.21.51.153` - **Port:** `5433` - **User:** `anthony` - **Password:** `1234567` - **Database:** `ImpulsaColectivo`

## Crear un usuario PROPIO con ACCESO REMOTO

``` sql
-- Crear usuario propio (por defecto puede conectarse desde cualquier host)
CREATE USER anthony_postgres WITH PASSWORD '1234567';

-- Dar permisos sobre la base de datos
GRANT ALL PRIVILEGES ON DATABASE ImpulsaColectivo TO anthony_postgres;
ALTER DATABASE ImpulsaColectivo OWNER TO anthony_postgres;
```

## Backup de una base de datos

``` bash
docker exec postgres-server pg_dump -U anthony -d ImpulsaColectivo > /mnt/c/academia/bd/backup_postgres_ImpulsaColectivo_$(date +%Y%m%d).sql
```

## Variables clave del .env

| Variable            | Descripcion                              |
|---------------------|------------------------------------------|
| `POSTGRES_USER`     | Usuario administrador (anthony)          |
| `POSTGRES_PASSWORD` | Password del administrador               |
| `POSTGRES_DB`       | Base de datos inicial creada al arrancar |
      

### 5.4 Levantar PostgreSQL

```bash
cd ~/ia-lab/services/motores-bd/postgres
docker compose up -d
```

``` bash
docker ps | grep postgres-server
docker logs postgres-server --tail 20
```

<p align="center">
  <img src="imagenes/levantar postgres.png">
</p>
