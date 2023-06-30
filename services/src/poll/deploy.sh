#!/bin/bash
echo "Deploying poll service"

installRunTimeNodePackage dev
buildNodePackage
deployServerlessComponent "POLL"
