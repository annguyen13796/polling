echo "Deploy Vote Services"

cd libs/common; rm -rf node_modules; rm -rf package-log.json; npm i; rm-rf dist; npm run build

cd ../..

cd services/vote; rm -rf node_modules; rm -rf package-log.json; npm i; rm-rf dist; npm run build

sls deploy
