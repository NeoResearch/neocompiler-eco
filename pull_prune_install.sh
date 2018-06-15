echo "performing git pull"
git pull

echo "PRUNING any useless NPM dep";
npm prune

echo "INSTALLING with NPM";
npm install
