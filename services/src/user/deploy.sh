#!/bin/bash
echo "Deploying user service"

installRunTimeNodePackage dev
buildNodePackage
deployServerlessComponent "USER"
