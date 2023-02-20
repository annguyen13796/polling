echo "Deploy Polling Services"

cd libs/common; rm -rf node_modules; rm -rf package-log.json; npm i; rm-rf dist; npm run build
cd ../..

echo "Deploy User Services"
cd services/user; rm -rf node_modules; rm -rf package-log.json; npm i; rm-rf dist; npm run build
sls deploy

cd ../..

echo "Deploy Poll Services"
cd services/poll; rm -rf node_modules; rm -rf package-log.json; npm i; rm-rf dist; npm run build
sls deploy
