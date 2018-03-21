if [ -z ${DOCKERNEOCOMPILER+x} ]; then 
   echo "DOCKERNEOCOMPILER var is unset";
else
   echo "DOCKERNEOCOMPILER=$DOCKERNEOCOMPILER";
   DEBUG=neocompiler:* PORT=8000 node app.js
fi
