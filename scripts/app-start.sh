#!/bin/bash
PATH="/root/.nvm/versions/node/v10.16.0/bin:$PATH"
cd /opt/app
node app.js > app.log 2>&1 &