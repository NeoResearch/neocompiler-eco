COMPILECODE=`cat TestContract.java | base64 -w 0`
docker run docker-java-neo-compiler -e COMPILECODE=$COMPILECODE 

