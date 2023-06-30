#!/bin/bash

# fail on error
set -e
# exec common script to import function
. ./__cicd__/common.sh

onBeforeCommand "SYSTEM INFORMATION"
# npm version should be 7.x.x to install omit dev successfully
echo NPM VERSION: $(npm -v)
onAfterCommand "SYSTEM INFORMATION"

installRunTimeNodePackage

onBeforeCommand "SERVICE DEPLOYMENT"

services=('infrastructure' 'libs' 'services')

for ((i = 0; i < ${#services[@]}; i++)); do
  service=${services[$i]}
  onBeforeCommand "DEPLOYING SERVICE: ${service}"
  invokeDeployScript $service "deploy"

  onAfterCommand "DEPLOYING SERVICE: ${service}"
done

onAfterCommand "SERVICE DEPLOYMENT"

