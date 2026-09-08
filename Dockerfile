# Use official Node.js runtime as base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application
COPY . .

# Expose the port (default 3000, but configurable)
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
