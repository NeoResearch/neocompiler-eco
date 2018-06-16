echo "performing git pull"
git pull

echo "updating submodule neon-opt"
git submodule update  --recursive

echo "PRUNING any useless NPM dep";
npm prune

echo "INSTALLING with NPM";
npm install
