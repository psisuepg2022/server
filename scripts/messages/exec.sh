#!/usr/bin/bash

node ./scripts/messages/insert.js "$1" "$2" "$3" | node ./scripts/messages/order.js