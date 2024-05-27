# Use the official Node.js image as the base image
FROM node:20.13.1-alpine3.20

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./
COPY . .
RUN npm cache clean --force && rm -rf node_modules && npm install

# Expose the application port (adjust if necessary)
EXPOSE 3000

CMD ["node", "server.js"]
