#!/bin/bash

echo "DELETING any previous publicTemp files"
rm -rf ./publicTemp/

echo "CREATING publicTemp..."
mkdir ./publicTemp/
mkdir ./publicTemp/public

echo "COPYING current frontend interface"
cp -r ../css ./publicTemp/public
cp -r ../fonts ./publicTemp/public
cp -r ../images ./publicTemp/public
cp -r ../js ./publicTemp/public
cp -r ../partials ./publicTemp/public
cp -r ../templates ./publicTemp/public
cp -r ../assets ./publicTemp/public
cp -r ../webfonts ./publicTemp/public
cp ../../index.html ./publicTemp/



echo "ADDING cordoba.js to index.html"
sed -i "/Our Website Javascripts/a<script type="text/javascript" charset="utf-8" src="cordova.js"></script>" ./publicTemp/index.html

#echo "MODYING default value of angularJS route variable path".
#sed -i '/BASE_ANGULARJS_PATH/aBASE_ANGULARJS_PATH = "https://neocompiler.io";' ./publicTemp/js/main.js

echo "COPYING config.xml configurations and permissions"
cp config.xml ./publicTemp/

echo "ZIPPING front-end and config.xml"
zip -r ./NeoCompiler-Phonegap-Android-v3.0-Apk.zip ./publicTemp

#rm -rf ./publicTemp/
