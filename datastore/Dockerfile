FROM postgres:13.4-alpine

ENV POSTGRES_USER postgres

ENV POSTGRES_PASSWORD password

ENV POSTGRES_DB wdi_worldbank

ADD processed /data/

ADD databaseLoad.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
