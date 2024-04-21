#!/bin/bash

# The types you want to patch without pouchdb- prefix
declare -a types=(
  "adapter-fruitdown"
  "adapter-http"
  "adapter-idb"
  "core"
  "replication"
)

for t in "${types[@]}"
do
  echo "Patching @types/pouchdb-${t}"
  sed -i'.bak' 's/export =/export default/' "node_modules/@types/pouchdb-${t}/index.d.ts"
done