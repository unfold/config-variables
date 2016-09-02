#!/bin/bash -e

if ! [ -e scripts/publish.sh ]; then
  echo >&2 "Please run scripts/publish.sh from the repo root"
  exit 1
fi

npm run build
cp package.json lib
cd lib && npm publish
