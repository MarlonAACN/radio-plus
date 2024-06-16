## Requirements

### .env file variables (.env)
```bash
NODE_ENV="production | development | test"
PORT="Server port"
SPOTIFY_CLIENT_ID="Client id of the radio plus application, given by spotify"
SPOTIFY_CLIENT_SECRET="Client secret of the radio plus application, given by spotify"
BACKEND_ORIGIN_URL="Url of backend. The base of this url needs to match the base of a redirect url base, set in the spotify radio plus config"
APP_ORIGIN_URL="Url of the frontend (related to CORS reasons)"
CORS_ORIGINS="Comma-separated list of valid origins if multiple (for CORS reasons)"
```
