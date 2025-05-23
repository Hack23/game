#!/bin/bash
set -e

echo "Setting up D-Bus..."
if [ ! -e "/var/run/dbus/system_bus_socket" ]; then
    sudo mkdir -p /var/run/dbus
    sudo dbus-daemon --system --fork
fi

echo "✓ Environment ready for Cypress"
