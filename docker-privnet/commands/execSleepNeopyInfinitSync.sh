#!/bin/bash

cd /neo-python/ 

stropen=`echo "open wallet w1.wallet" | xxd -p`
strrebuild=`echo "wallet rebuild" | xxd -p`

python3.6 unsafeprompt.py -p -e $strrebuild,$stropen
