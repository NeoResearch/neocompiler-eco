#!/bin/bash
set -e

PORT_9000=`echo "ecoservices-neo3.neocompiler.io"`
PORT_10000=`echo "compilers-neo3.neocompiler.io"`
PORT_30333=`echo "node1-neo3.neocompiler.io"`
PORT_30334=`echo "node2-neo3.neocompiler.io"`
PORT_30337=`echo "node3-neo3.neocompiler.io"`

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
