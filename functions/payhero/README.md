# Baraka Homes PayHero function

This Appwrite Function keeps PayHero API credentials out of the Expo application.

Configure encrypted function variables:

- `PAYHERO_API_USERNAME`
- `PAYHERO_API_PASSWORD`
- `PAYHERO_CHANNEL_ID`
- `PAYHERO_CALLBACK_URL` (the function domain ending in `/payments/callback`)
- `PAYHERO_CALLBACK_TOKEN` (a long random secret)
- `PAYHERO_CALLBACK_FORWARD_URL` (optional private ledger webhook)

Use the Node.js 22 runtime, entrypoint `src/main.js`, and grant execute permission to `users` only. After deployment, put the Appwrite function ID in the mobile app as `EXPO_PUBLIC_APPWRITE_PAYHERO_FUNCTION_ID`.

Routes:

- `POST /payments/initiate` — authenticated tenant STK Push
- `POST /payments/callback?token=...` — PayHero callback
- `GET /health` — configuration health check without exposing secrets

