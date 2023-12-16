# h0h0h0day2022

This challenge can be run with docker compose. 3 Services are deployed:
- A portal
- An api
- An openid server

To run the challenge, create a `.env` in the root folder (same folder as docker-compose.yml file) of this repo and put the following inside:

```
HOSTNAME=[Hostname where the challenge is going to be deployed]
OIDC_PORT=44000 [Any available port]
FRONT_END_PORT=44030 [Any available port]
API_PORT=44060 [Any available port]
```

Replace values in your environment by what is relevant to your environment. The execute `docker compose up`.