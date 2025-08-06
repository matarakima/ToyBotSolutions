# Use official Node.js LTS image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the backend code
COPY . .

# Expose the port your Fastify/Express app runs on
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
