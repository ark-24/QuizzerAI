# Base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the project
COPY . .

# Build the app
RUN npm run build

# Expose the port
EXPOSE 5173

# Serve the app
CMD ["npm", "run", "serve"]
