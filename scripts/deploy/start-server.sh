#!/usr/bin/bash

sudo docker start "${DEV_CONTAINER}" && \
pm2 start yarn --name "${DEPLOY_PM2_SERVICE_NAME}" -- start