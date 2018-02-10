if [ -z ${DOCKERPRIV+x} ]; then 
   echo "DOCKERPRIV var is unset";
else
   echo "DOCKERPRIV=$DOCKERPRIV";
   docker exec -it neo-privnet-with-gas /bin/bash
fi
