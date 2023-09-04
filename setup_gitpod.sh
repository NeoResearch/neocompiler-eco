#!/bin/bash

set -e

# Increase MaxConcurrentConnections for improving gitpod overload problems
sed -i '/MaxConcurrentConnections/c\\t\t\t\t"MaxConcurrentConnections": '1000',' ./docker-compose-eco-network/neo-cli/configs/plugins/rpcServer1.json

# check if gitpod exists
gp info  > gitpod.txt

# ================
# get workspace id
# 
WID=`sed -n 1p gitpod.txt | awk -F: '{print $2}' | sed -e 's/ //g'`
echo "Workspace ID: $WID"
# ================
# get cluster host
#
CHOST=`sed -n 6p gitpod.txt | awk -F: '{print $2}' | sed -e 's/ //g'`
echo "Cluster Host: $CHOST"

# https://www.gitpod.io/docs/configure/workspaces/ports

# EXAMPLE:
# https://8000-neoresearch-neocompiler-len9qk36eo0.ws-us104.gitpod.io

# PORT_8000=`gp url 8000` # HARDER TO REMOVE https:// prefix...
PORT_8000=`echo "8000-${WID}.${CHOST}"`
# echo $PORT_8000   # NO HTTPS HERE!!!
# 8000-neoresearch-neocompiler-len9qk36eo0.ws-us104.gitpod.io
PORT_9000=`echo "9000-${WID}.${CHOST}"`
PORT_10000=`echo "10000-${WID}.${CHOST}"`
PORT_30333=`echo "30333-${WID}.${CHOST}"`
PORT_30334=`echo "30334-${WID}.${CHOST}"`
PORT_30337=`echo "30337-${WID}.${CHOST}"`

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
