#!/bin/bash

set -e

# echo $(jq -r ".CODESPACE_NAME" /workspaces/.codespaces/shared/environment-variables.json)
CHOST=${CODESPACE_NAME}

PORT_8000=`echo "${CHOST}-8000.app.github.dev"`
PORT_9000=`echo "${CHOST}-9000.app.github.dev"`
PORT_10000=`echo "${CHOST}-10000.app.github.dev"`
PORT_30333=`echo "${CHOST}-30333.app.github.dev"`
PORT_30334=`echo "${CHOST}-30334.app.github.dev"`
PORT_30337=`echo "${CHOST}-30337.app.github.dev"`

# personalized javascript url
P_URL="assets/info/personalized.js"

echo "   personalizedNodes = ["              > $P_URL
echo "      {"                               >> $P_URL
echo "         \"protocol\": \"https\","     >> $P_URL    
echo "         \"url\": \"$PORT_10000\","    >> $P_URL    
echo "         \"location\": \"worldwide\"," >> $P_URL    
echo "         \"locale\": \"worldwide\","   >> $P_URL    
echo "         \"type\": \"ecocompilers\""   >> $P_URL    
echo "      },"                              >> $P_URL 
echo "      {"                               >> $P_URL
echo "         \"protocol\": \"https\","     >> $P_URL    
echo "         \"url\": \"$PORT_9000\","     >> $P_URL    
echo "         \"location\": \"worldwide\"," >> $P_URL    
echo "         \"locale\": \"worldwide\","   >> $P_URL    
echo "         \"type\": \"ecoservices\""    >> $P_URL    
echo "      },"                              >> $P_URL 
echo "      {"                               >> $P_URL
echo "         \"protocol\": \"https\","     >> $P_URL    
echo "         \"url\": \"$PORT_30333\","    >> $P_URL    
echo "         \"location\": \"worldwide\"," >> $P_URL    
echo "         \"locale\": \"worldwide\","   >> $P_URL    
echo "         \"type\": \"RPC\""            >> $P_URL    
echo "      },"                              >> $P_URL 
echo "      {"                               >> $P_URL
echo "         \"protocol\": \"https\","     >> $P_URL    
echo "         \"url\": \"$PORT_30334\","    >> $P_URL    
echo "         \"location\": \"worldwide\"," >> $P_URL    
echo "         \"locale\": \"worldwide\","   >> $P_URL    
echo "         \"type\": \"RPC\""            >> $P_URL    
echo "      },"                              >> $P_URL 
echo "      {"                               >> $P_URL
echo "         \"protocol\": \"https\","     >> $P_URL    
echo "         \"url\": \"$PORT_30337\","    >> $P_URL    
echo "         \"location\": \"worldwide\"," >> $P_URL    
echo "         \"locale\": \"worldwide\","   >> $P_URL    
echo "         \"type\": \"RPC\""            >> $P_URL    
echo "      }"                               >> $P_URL 
echo "  ]"                                   >> $P_URL 

echo "Finished updating $P_URL"
