#!/bin/bash

onBeforeCommand "DEPLOYING LIBS"

prioritizedComponents=('layers')

deploySubComponents "${prioritizedComponents[*]}"