#!/usr/bin/bash

pm2 stop "$DEPLOY_PM2_SERVICE_NAME" && \
git pull && \
rm -rf dist && \
yarn build && \
pm2 start "$DEPLOY_PM2_SERVICE_NAME"