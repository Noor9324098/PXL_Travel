# API tests

Black-box tests for the backend. They start the unchanged `Backend/server.js` as a separate
process against a temporary in-memory MongoDB and test all 17 REST endpoints over HTTP.
No external services are called: the Groq and Aviationstack keys are left unset on purpose,
so only input validation and configuration handling of those two endpoints are tested.

```sh
cd Backend && npm install      # backend dependencies
cd ../tests/api && npm install # test dependencies (downloads a MongoDB binary on first run)
npm test
```

Requirements: Node.js 20 or newer (uses the built-in `node:test` runner and `fetch`).
