#!/bin/bash

set -e

echo "NeoCompiler Eco - Remote Compiler for C#. Parameters $#"

LOCAL_FILE=""
REMOTE_SERVER=""
#LANGUAGE="csharp"
#DOCKER_LANGUAGE="docker-mono-neo-compiler"

if [ $# != 2 ]
then
  echo "expects three parameters (server, file): ./remote_compile_cs.sh http://localhost:10000 exemplo.cs"
  echo "results are: output.err output.avm output.abi"
  exit 1;
else
  REMOTE_SERVER=$1
  LOCAL_FILE=$2
fi  

echo "Using: server=$REMOTE_SERVER file=$LOCAL_FILE"

COMPILE_SERVER_2x=$REMOTE_SERVER

jq --version # echo "we need command 'jq' to parse json structure"

WELCOME=`curl -s "$COMPILE_SERVER_2x" | jq '.welcome'`
echo "$WELCOME"

NUM=`curl -s "$COMPILE_SERVER_2x/getCompilers" | jq 'length'`

echo "$NUM general compilers found."

NUM_CSHARP=`curl -s "$COMPILE_SERVER_2x/getCompilers" | jq '.[] | select(.compiler=="docker-mono-neo-compiler") | length'`

echo "$NUM_CSHARP C# compilers found."

CSHARP_LATEST=`curl -s "$COMPILE_SERVER_2x/getCompilers" | jq '.[] | select(.compiler=="docker-mono-neo-compiler") | select(.version=="latest")'`

echo "latest: $CSHARP_LATEST"

echo "====== WILL ZIP CODE ======="
echo "${LOCAL_FILE}  => ${LOCAL_FILE}.zip"
zip -r ${LOCAL_FILE}.zip ${LOCAL_FILE}
CODE=`cat ${LOCAL_FILE}.zip | base64 -w 0`


#echo "CODE=$CODE"

#echo "======= TESTING ZIP ========"
#echo "$CODE" | base64 --decode | funzip > tmp_teste.cs

echo "====== WILL SUBMIT CODE ======"

###echo "test: -d 'codesend_selected_compiler=\"csharp\"' -d 'compilers_versions=docker-mono-neo-compiler:latest' -d \"codesend_cs='$CODE'\""

JSON_DATA=$(jq --null-input --arg content "${CODE}" '{"codesend_cs": $content ,"codesend_selected_compiler":"csharp","compilers_versions":"docker-mono-neo-compiler:latest"}')

#echo "JSON: $JSON_DATA"
echo "..."

#OUT=`curl -s -X POST -d 'codesend_selected_compiler="csharp"' -d 'compilers_versions=docker-mono-neo-compiler:latest' --data-binary "codesend_cs=$CODE" "$COMPILE_SERVER_2x/compilex"`
OUT=`curl -s -X POST -H "Content-Type: application/json"  --data "${JSON_DATA}" -w "\n" "$COMPILE_SERVER_2x/compilex"`

echo "====== PROCESSING RESPONSE ======"

echo "Generating files: output.err  output.avm   output.abi"

echo "$OUT" | jq -r '.output' | base64 --decode > output.err
echo "$OUT" | jq -r '.avm'    | base64 --decode > output.avm
echo "$OUT" | jq -r '.abi'    | base64 --decode > output.abi


echo "FINISHED!"
