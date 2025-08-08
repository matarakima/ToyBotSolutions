
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

# Las variables de entorno se asignan automáticamente por Azure/GitHub Actions
# No es necesario copiar .env en producción si usas variables del entorno
# Si quieres forzar la carga desde .env, puedes usar dotenv en tu app

# Start the app
CMD ["npm", "start"]
