#!/bin/bash
echo "Deploying report service"

installRunTimeNodePackage dev
buildNodePackage
deployServerlessComponent "REPORT"
