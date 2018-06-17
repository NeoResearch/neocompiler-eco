#NPM Prune and Install before starting node backend
./npm_prune_install.sh

export COMMIT_GIT_VERSION=`git log --format="%H" -n 1`
DEBUG=neocompiler:* PORT=8000 node app.js
