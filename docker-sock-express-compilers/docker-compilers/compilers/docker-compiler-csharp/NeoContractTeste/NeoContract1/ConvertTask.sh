echo "Compatible mode is $COMPATIBLE"
(cd bin/Release && dotnet neon.dll $COMPATIBLE NeoContract1.dll)
