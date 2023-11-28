#!/usr/bin/with-contenv bashio
set +u

export PORT=$(bashio::config 'port')

bashio::log.info "Starting Smart Organizer. => run.sh***"
npm run start