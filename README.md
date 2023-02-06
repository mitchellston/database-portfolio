# Portfolio

A web application to create database portfolios

---

## Getting Started

1. Create a .env file.
```
# Since .env is gitignored, you can use .env.example to build a new `.env` file when you clone the repo.
# Keep this file up-to-date when you add new variables to `.env`.

# This file will be committed to version control, so make sure not to have any secrets in it.
# If you are cloning this repo, create a copy of this file named `.env` and populate it with your secrets.

# When adding additional env variables, the schema in /env/schema.mjs should be updated accordingly
# Prisma
DATABASE_URL=file:./db.sqlite

# Next Auth
# You can generate the secret via 'openssl rand -base64 32' on Linux
# More info: https://next-auth.js.org/configuration/options#secret
# NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
# JWT secret
JWT_SECRET=JWT_SECRET

# Discord oauth client id and secret
# https://discord.com/developers/applications
DISCORD_CLIENT_ID=DISCORD_CLIENT_ID
DISCORD_CLIENT_SECRET=DISCORD_CLIENT_SECRET

# Github oauth client id and secret
# https://github.com/settings/developers
GITHUB_CLIENT_ID=GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET=GITHUB_SECRET_ID
```

2. Start the dev server
```bash
pnpm dev
```
3. Go to [localhost:3000](http://localhost:3000) to see the application
