echo "Deploy Report Services"

cd libs/common; rm -rf node_modules; rm -rf package-log.json; npm i; rm-rf dist; npm run build; npm prune --production

cd ../..

cd services/report; rm -rf node_modules; rm -rf package-log.json; npm i; rm-rf dist; npm run build; npm prune --production

sls deploy
