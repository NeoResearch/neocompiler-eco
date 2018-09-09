echo "performing git pull"
git pull

echo "updating submodule neon-opt"
git submodule update --init
(cd public/js/common/neon-opt && git pull origin master)  #git submodule update  --recursive
