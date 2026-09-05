# ICU-Website

ICU monitoring dashboard built with React, TypeScript, Vite, Express, Prisma, MySQL, and Socket.io.

## Run

- Frontend: `npm install` then `npm run dev`
- Backend: `cd server`, `npm install`, then `npm run dev`

## Local HTTPS

Run `powershell -ExecutionPolicy Bypass -File scripts/create-dev-cert.ps1` from the project root.
After `certs/localhost-key.pem` and `certs/localhost-cert.pem` exist, the Vite frontend and Express backend start on HTTPS automatically.
To remove the browser's self-signed certificate warning, run `powershell -ExecutionPolicy Bypass -File scripts/trust-dev-cert.ps1` once for your Windows user.
