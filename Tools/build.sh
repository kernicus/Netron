#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

rm -f -r ../Build
mkdir -p ../Build/Debug
mkdir -p ../Build/Release

echo Building \'Release/*.html\'
cp ../Samples/demo_orgchart.html ../Build/Debug/demo_orgchart.html

echo Building \'Release/*.html\'
cp ../Samples/demo_orgchart.html ../Build/Release/demo_orgchart.html

echo Building \'Debug/netron.js\'
node tsc.js -target ES5 -out ../Build/Debug/netron.js lib.d.ts libex.d.ts ../Source/*.ts

echo Building \'Release/netron.js\'
node minify.js ../Build/Debug/netron.js ../Build/Release/netron.js

echo Done.
