echo "Deploy Polling PROJECT"

cd libs/common; rm -rf node_modules; rm -rf package-log.json; npm i; rm-rf dist; npm run build; npm prune --production


cd ../..
echo "Deploy User Service"
cd services/user; rm -rf node_modules; rm -rf package-log.json; npm i; rm-rf dist; npm run build; npm prune --production
sls deploy


cd ../..
echo "Deploy Poll Service"
cd services/poll; rm -rf node_modules; rm -rf package-log.json; npm i; rm-rf dist; npm run build; npm prune --production
sls deploy


cd ../..
echo "Deploy Report Service"
cd services/report; rm -rf node_modules; rm -rf package-log.json; npm i; rm-rf dist; npm run build; npm prune --production
sls deploy


cd ../..
echo "Deploy Vote Service"
cd services/vote; rm -rf node_modules; rm -rf package-log.json; npm i; rm-rf dist; npm run build; npm prune --production
sls deploy