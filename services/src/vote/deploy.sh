#!/bin/bash
echo "Deploying vote service"

installRunTimeNodePackage dev
buildNodePackage
deployServerlessComponent "VOTE"
