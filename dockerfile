FROM node:18

# Set working directory in container
WORKDIR /usr/src/app

# Copy server directory only local container
COPY ./package*.json ./

# install dependencies
RUN npm install pm2 -g && npm install

# Now copy rest of your app
COPY ./ ./
# Expose the port your app runs on
EXPOSE 7098

# Run your app
# Two ways to restart on failure 1. use docker restart policy 2. using PM2
CMD ["node", "server.js"]  # or whatever your entry point is