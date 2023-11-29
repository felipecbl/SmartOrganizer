#!/usr/bin/with-contenv bashio
set +u

# export PORT=$(bashio::config 'port')

bashio::log.info "Starting Smart Organizer..."
npm run start