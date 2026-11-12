# FRESH DEPLOYMENT
```sh
cd DiceCloud
docker build --progress=plain --build-arg SOURCE_REVISION="$(git rev-parse HEAD)" -t dicecloud:runtime .
python3 deployment/initialize.py --directory ~/.srv/dicecloud-config
```

```sh
nano ~/.srv/dicecloud-config/runtime.env
```

Edit ROOT_URL to https://willsdicecloud.co.uk

# ON WSL
```sh
docker compose --env-file ~/.srv/dicecloud-config/runtime.env -p dicecloud-private up -d --no-build --wait
curl --fail http://127.0.0.1:31080/api/status
```

# ON WINDOWS
caddy reverse-proxy --from https://willsdicecloud.co.uk --to :31080
