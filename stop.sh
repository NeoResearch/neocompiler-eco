SERVER=`fuser 8000/tcp` 
kill -9 $SERVER
cd docker-neo-scan && docker-compose stop

