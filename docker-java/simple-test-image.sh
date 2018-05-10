COMPILECODE=`cat TestContract.java | base64 -w 0`
docker run docker-java-neo-compiler -e COMPILECODE=$COMPILECODE | cut -c14- | rev | cut -c24- | rev | base64 --decode


