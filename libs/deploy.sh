#!/bin/bash

onBeforeCommand "DEPLOYING LIBS"

prioritizedComponents=('common')

deploySubComponents "${prioritizedComponents[*]}"