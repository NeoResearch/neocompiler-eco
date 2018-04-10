#!/bin/bash

echo "COPYING current frontend interface"
cp -r ../css ./publicTemp/
cp -r ../fonts ./publicTemp/
cp -r ../images ./publicTemp/
cp -r ../js ./publicTemp/
cp -r ../partials ./publicTemp/
cp -r ../templates ./publicTemp/
cp -r ../index.html ./publicTemp/

echo "ADDING cordoba.js to index.html"
sed -i "/Our Website Javascripts/a<script type="text/javascript" charset="utf-8" src="cordova.js"></script>" ./publicTemp/index.html

echo "COPYING config.xml configurations and permissions"
cp config.xml ./publicTemp/

echo "ZIPPING front-end and config.xml"
zip -r ./NeoCompiler-Phonegap-Android-v1.0-Apk.zip ./publicTemp

rm -rf ./publicTemp/

