# A Roadrunner Admin Panel - Setup Guide

## Quick Setup Commands

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Setup environment
cp .env.example .env

# 3. Start development server
npm run dev
```

Server runs on: `http://localhost:3100`

## Internationalization

Add `Accept-Language: ar` header for Arabic responses.

## Encrypt the .env file

npx dotenvx encrypt

## Decrypt the .env file

npx dotenvx decrypt

## If vulnerability found

npm audit fix --legacy-peer-deps
