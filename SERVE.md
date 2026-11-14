# USE CASE: WSL ON WINDOWS

This runbook documents a particular case, where the app is served inside WSL, opening local ports and running a reverse proxy on the Windows side. In this example Python is handled via uv.

## FRESH DEPLOYMENT

```sh
cd DiceCloud
docker build --progress=plain --build-arg SOURCE_REVISION="$(git rev-parse HEAD)" -t dicecloud:runtime .
uv run deployment/initialize.py --directory ~/.srv/dicecloud-config
```

```sh
nano ~/.srv/dicecloud-config/runtime.env
```

Edit ROOT_URL to the web address e.g. https://example.domain

## ON WSL

```sh
docker compose --env-file ~/.srv/dicecloud-config/runtime.env -p dicecloud-private up -d --no-build --wait
curl --fail http://127.0.0.1:31080/api/status
```

## ON WINDOWS

Open firewall for HTTPS traffic

```sh
caddy reverse-proxy --from https://example.domain --to :31080
```

# MANAGING MONGODB

Use the password in `~/.srv/dicecloud-config/secrets/mongo_root_password`. Username is administrator, authSource=admin. Connect using MongoDB connect.

To give a user admin access, append `roles: ["admin"]` to the user record in the database's users collection.

# ADDING ICONS

Follow instructions in `app/imports/client/ui/icons/importIcons.js` to get the correct sprite json and metadata json. With admin permission as above, visit the page /icon-admin and upload the files.
