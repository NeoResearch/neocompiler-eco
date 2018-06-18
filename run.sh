export COMMIT_GIT_VERSION=`git log --format="%H" -n 1`
DEBUG=neocompiler:* PORT=8000 node app.js
