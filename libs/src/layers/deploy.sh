
#!/bin/bash

onBeforeCommand "INSTALLING TVB COMMON LAYERS"

layerComponents=('../notification')
for val in ${layerComponents[@]}; do
    cd $val
    installRunTimeNodePackage
    cd -
done

onAfterCommand "INSTALLING TVB COMMON LAYERS"

layers=('./src/notification/nodejs')
for val in ${layers[@]}; do
    cd $val
    installRunTimeNodePackage
    cd -
done

deployServerlessComponent 'TVB COMMON LAYERS'
