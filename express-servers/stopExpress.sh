#Http
fuser -k  8000/tcp
#Eco Services
fuser -k  10000/tcp
#Python network services
fuser -k  8500/tcp
#Compilers
fuser -k  9000/tcp

#kill -9 fuser 8000/tcp
