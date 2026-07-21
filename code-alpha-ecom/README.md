This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

This repository keeps secrets out of source control. The `.env*` pattern in `.gitignore` ensures your local `.env` file is not committed.

1. Copy `.env.example` to `.env`.
2. Update the values with your own credentials.
3. In GitHub Codespaces, use repository or organization secrets instead of committing secrets.
4. If you run `next dev` in Codespaces, set `NEXTAUTH_URL` to the app URL shown by Codespaces preview or use `http://localhost:3000` for standard forwarded ports.

Required variables:

- `MONGO_URI`
- `GOOGLE_API_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `OPENAI_API_KEY`

## GitHub Codespaces

1. Open this repository in GitHub Codespaces.
2. Set the required secrets in the repository or organization settings:
   - `MONGO_URI`
   - `GOOGLE_API_KEY`
   - `NEXTAUTH_SECRET`
   - `OPENAI_API_KEY`
3. Codespaces will use the `.devcontainer/devcontainer.json` configuration.
4. Start the app with:
   ```bash
   npm run dev
   ```
5. Use the forwarded port `3000` or the Codespaces browser preview to access the app.

For local development, copy `.env.example` to `.env` and fill in your secret values.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
