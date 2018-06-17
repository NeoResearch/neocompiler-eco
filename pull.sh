echo "performing git pull"
git pull

echo "updating submodule neon-opt"
(cd public/js/common/neon-opt && git pull origin master)  #git submodule update  --recursive
