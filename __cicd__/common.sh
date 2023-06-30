#!/bin/bash

function breakLine() {
    echo -e "=============================="
    echo -e
}

function onBeforeCommand() {
    echo $1
    breakLine
}

function onMiddleCommand() {
    echo $1
    echo -e
}

function onAfterCommand() {
    echo FINISHED $1
    breakLine
}

function deployServerlessComponent() {
    onBeforeCommand "DEPLOYING: $1"

    # deploy function here
    sls deploy --stage $AWS_STAGE --region $AWS_REGION --stage $AWS_STAGE

    onAfterCommand "DEPLOYING: $1"
}

function invokeDeployScript() {
    local oldPath=$PWD
    local destination=$1
    local scriptName=$2

    cd $destination
    if [[ -e "${scriptName}.sh" ]]; then
        . ./${scriptName}.sh
    fi
    cd $oldPath
}

# $1=dev is to install dev dependency
# default dev would be omitted
function installRunTimeNodePackage() {
    onBeforeCommand "INSTALLING RUN TIME NODE PACKAGES"
    if [[ $1 == 'dev' ]]; then
        npm i 
    else
        npm i --omit=dev
    fi
} 

function buildNodePackage() {
    onBeforeCommand "BUILDING NODE PACKAGES"
    npm run build
} 

function deploySubComponents() {
    onBeforeCommand "DEPLOYING SUB COMPONENTS AT $PWD"
    # Array of components are below
    local prioritizedComponents=($1)
    local finalDeployedComponents=($2)
    local scriptName=($3)
    # associate array of components are below
    local -A mapPrioritizedComponents
    local -A mapFinalDeployedComponents

    onBeforeCommand "INIT MAP"

    for val in ${prioritizedComponents[@]}; do
        mapPrioritizedComponents+=(["$val"]="$val")
    done

    for val in ${finalDeployedComponents[@]}; do
        mapFinalDeployedComponents+=(["$val"]="$val")
    done

    onAfterCommand "INIT MAP"

    onBeforeCommand "DEPLOY PRIORITIZED COMPONENTS"

    for val in ${prioritizedComponents[@]}; do
        # If scriptName is empty, use the default name: "deploy"
        invokeDeployScript ./src/$val ${scriptName:="deploy"}
    done

    onAfterCommand "DEPLOY PRIORITIZED COMPONENTS"

    onBeforeCommand "DEPLOY COMPONENTS"

    for componentPath in ./src/*; do
        # extract from ./src/ get component directory
        component=${componentPath##*/}
        isExlucdedFromPrioritizedStr=${mapPrioritizedComponents[$component]}
        isExlucdedFromFinalDeployedStr=${mapFinalDeployedComponents[$component]}

        # if it's an empty string, deploy
        if [[ -z $isExlucdedFromPrioritizedStr && -z $isExlucdedFromFinalDeployedStr ]]; then
            invokeDeployScript $componentPath ${scriptName:="deploy"}
        fi
    done

    onAfterCommand "DEPLOY COMPONENTS"

    onBeforeCommand "DEPLOY FINAL DEPLOYED COMPONENTS"

    for val in ${finalDeployedComponents[@]}; do
        invokeDeployScript ./src/$val ${scriptName:="deploy"}
    done

    onAfterCommand "DEPLOY FINAL DEPLOYED COMPONENTS"

    onAfterCommand "DEPLOYING SUB COMPONENTS AT $PWD"
}
