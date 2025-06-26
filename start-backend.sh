#!/bin/bash
echo "Starting TMF632 Party Management API..."
echo ""
echo "Make sure MongoDB is running before starting the API"
echo "Default MongoDB connection: mongodb://localhost:27017/party-management"
echo ""
cd "Party Management API"
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo ""
    echo "Please edit .env file with your MongoDB configuration"
    read -p "Press any key to continue..."
fi
echo "Starting server..."
npm start
