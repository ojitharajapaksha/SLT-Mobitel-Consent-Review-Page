@echo off
echo Starting TMF632 Party Management API...
echo.
echo Make sure MongoDB is running before starting the API
echo Default MongoDB connection: mongodb://localhost:27017/party-management
echo.
cd "Party Management API"
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo Please edit .env file with your MongoDB configuration
    echo Press any key to continue...
    pause > nul
)
echo Starting server...
npm start
