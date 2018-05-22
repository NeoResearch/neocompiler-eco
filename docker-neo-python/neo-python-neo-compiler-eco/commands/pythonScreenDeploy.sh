#!/bin/bash

# $1 == HASH
# import contract $2 $3 $4 $5 $6
# import contract hash.avm "params" 01 False False


if (( $# != 7 )); then
	echo "WRONG Parameter. Pass: [1 - Screen name]";
	echo "2 - HASH, import contract 3-7. Example: import contract hash.avm params 01 False False"

else
	PYTHON_PATH=`echo "$1" | base64 --decode`
	echo "Path is " + $1 + " or : " + $PYTHON_PATH
	
	lhash=`echo "$2" | base64 --decode`
	echo "HASH: $lhash"
	echo "code: $3"
	echo "$3" | base64 --decode | xxd -p -r > $lhash.avm
	parm=`echo $4 | base64 --decode`
	rv=`echo $5 | base64 --decode`
	rv=`echo \"$rv\"`
	op1=`echo $6 | base64 --decode`
	op2=`echo $7 | base64 --decode`
	strimport=`echo "import contract $lhash.avm $parm $rv $op1 $op2^M"

	echo "calling python for deploy with " + $strimport
	screen -L -Logfile /$PYTHON_PATH/pythonScreen.log -S $PYTHON_SCREEN -p 0 -X stuff $strimport
fi

#example: ./pythonScreenDeploy.sh SCREEN M2ZlMTY2ZTczMzIwYTVlZDNmZTg0YTFkNjhlMmRlMmE2YTk1YmJiZAo= MDBjNTZiNjE2Yzc1NjYK IiIK MDEK RmFsc2UK
#outside: docker exec -t neo-privnet-with-gas dash -i -c "./execimportcontract.sh M2ZlMTY2ZTczMzIwYTVlZDNmZTg0YTFkNjhlMmRlMmE2YTk1YmJiZAo= MDBjNTZiNjE2Yzc1NjYK IiIK MDEK RmFsc2UK RmFsc2UK" > saida.log
