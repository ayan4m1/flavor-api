# flavor-api

This repository is a proof-of-concept of a simple REST API written using Node.js.

## libraries

- [Express](https://expressjs.com/)
- Google OpenID auth via [passport-google-openidconnect](https://github.com/kkkon/passport-google-openidconnect).
- [pg](https://github.com/brianc/node-postgres) as a PostgreSQL client
- [postgrator](https://github.com/rickbergfalk/postgrator) to handle SQL migrations

## usage

Before use, from psql as the `postgres` user:

```sql
create database flavors;
create user flavors with encrypted password 'changeme';
grant all privileges on database flavors to flavors;
\c flavors
create extension if not exists "pgcrypto";
```

The `pgcrypto` extension is used to generate UUIDs.

Now, in a shell:

```sh
npm install
cp .flavorrc.default.yml .flavorrc.yml
```

Configuration resides in `.flavorrc.yml`. Edit this file and supply your database information. Finally:

```sh
npm run migrate
npm start
```

You can use `npm run migrate 0` to revert all database migrations, or `npm run migrate X` to migrate to version X.
