CONTAINER_NAME="neo-compiler-privnet-with-gas"

if [ -n "$DOCKERPRIV" ]; then
	echo "Stopping container named $CONTAINER_NAME"
	docker stop $CONTAINER_NAME 1>/dev/null
	echo "Removing container named $CONTAINER_NAME"
	docker rm $CONTAINER_NAME 1>/dev/null
fi

if [ -z ${DOCKERPRIV+x} ]; then 
   echo "DOCKERPRIV var is unset";
else
   echo "DOCKERPRIV=$DOCKERPRIV";
   docker run -d --name $CONTAINER_NAME --rm -p 20333-20336:20333-20336/tcp -p 30333-30336:30333-30336/tcp $DOCKERPRIV

   # open wallet example:
   # python3 unsafeprompt.py -p -e 6f70656e2077616c6c65742077312e77616c6c65740a
fi
