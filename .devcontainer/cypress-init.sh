#!/bin/bash
# Start Xvfb
Xvfb :99 &
export DISPLAY=:99
# Verify Cypress installation
npx cypress verify
