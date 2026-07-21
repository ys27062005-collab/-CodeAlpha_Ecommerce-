#run this project on codespace 


GitHub Codespaces Setup
This repository is configured to run in GitHub Codespaces without committing a .env file.

What is included🥇

.devcontainer/devcontainer.json for Codespaces container configuration
.devcontainer/docker-compose.yml to run the Node app and MongoDB service
server/.env.example and client/.env.example for local environment variable templates
root package.json scripts to start server and client together
Run in Codespaces

Open this repository in GitHub Codespaces.

Set these values as Codespaces environment variables or repository/user secrets:

MONGO_URI
DB_NAME
JWT_SECRET
JWT_EXPIRE
CLIENT_URL

Rebuild the container from the Command Palette with "Dev Containers: Rebuild Container".

Start the app:
terminal 1:
   cd server
   npm install
   npm run dev
terminal 2:
   cd client
   npm install
   npm run dev
# this commond run on two terminal 
  

