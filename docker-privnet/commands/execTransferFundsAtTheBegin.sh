#!/bin/bash

cd /opt/neo-python/
rm -rf Chains/privnet
rm -rf Chains/privnet/*
rm -rf Chains/*

send1=`echo "send neo APLJBPhtRg2XLhtpxEHd6aRNL7YSLGH2ZL 10000" | xxd -p -c 256`
send2=`echo "send gas APLJBPhtRg2XLhtpxEHd6aRNL7YSLGH2ZL 1000" | xxd -p -c 256`
send3=`echo "send neo AXxCjds5Fxy7VSrriDMbCrSRTxpRdvmLtx 20000" | xxd -p -c 256`
send4=`echo "send gas AXxCjds5Fxy7VSrriDMbCrSRTxpRdvmLtx 200" | xxd -p -c 256`
send5=`echo "send neo AQaJZTKshTQzcCKmsaoNVrtSP1pEB3Utn9 30000" | xxd -p -c 256`
send6=`echo "send gas AQaJZTKshTQzcCKmsaoNVrtSP1pEB3Utn9 300" | xxd -p -c 256`
stropen=`echo "open wallet w1.wallet" | xxd -p`
strrebuild=`echo "wallet rebuild" | xxd -p`
strexit=`echo "exit" | xxd -p`

python3 unsafeprompt.py -p -e $strexit,$strrebuild,$send1,$strrebuild,$send2,$strrebuild,$send3,$strrebuild,$send4,$strrebuild,$send5,$strrebuild,$send6,$strrebuild,$stropen

#example: ./exectransferfundsAtTheBegin.sh
#outside: docker exec -t neo-privnet-with-gas dash -i -c "./exectransferfundsAtTheBegin.sh" > saida.log
