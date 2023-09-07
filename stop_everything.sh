echo "STOPPING C# nodes";
(cd docker-compose-eco-network; ./stopCompose-EcoNodes.sh)

echo "STOPPING all docker with express services (default) : compilers, ecoservices and front-end-http";
(cd docker-sock-express-compilers; ./stopDockersExpressServers.sh)
