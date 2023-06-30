#!/bin/bash

onBeforeCommand "DEPLOYING SERVICES"

prioritizedComponents=('user' 'poll' 'vote')
finalDeployedComponents=('report')

deploySubComponents "${prioritizedComponents[*]}"