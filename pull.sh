echo "performing git pull"
git pull

echo "updating submodule neon-opt"
#git submodule update --init --recursive
git submodule update --recursive --remote
(cd public/js/eco-scripts/neon-opt && git pull origin master)
