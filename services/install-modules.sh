
#!/bin/bash

# Change directory to src folder
cd src

# Loop through each subdirectory in src
for dir in */; do
    echo "-----------------------------"

    # Change directory to subdirectory
    cd "$dir"

    # Check if package.json file exists
    if [ -f "package.json" ]; then
        echo "Installing node_modules for ${PWD##*/}"
        rm -rf node_modules
        rm -rf package-lock.json
        npm install
    else
        echo "package.json does not exist in ${PWD##*/}"
    fi

    # Change directory back to src folder
    cd ..
done


