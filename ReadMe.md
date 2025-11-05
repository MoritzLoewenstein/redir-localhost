# redir-localhost

A simple redirect server utility for local development. Redirects GET requests to localhost URLs while preserving all query parameters.

## Usage

Start the server:

```bash
npm run start
```

Visit `http://localhost:3000/http://localhost:8080?foo=bar` and it redirects to `http://localhost:8080?foo=bar`.

## Use Case

Useful when working with OAuth callbacks, webhooks, or other integrations that require redirect URLs during local development. Instead of configuring multiple callback URLs, use this server to redirect to your local development server with query params intact.

## Security

- Only `localhost` URLs are allowed
- Only `http://` and `https://` protocols are permitted
- Full protocol must be included in the URL path
