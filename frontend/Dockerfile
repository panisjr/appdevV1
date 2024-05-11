# Use a base image with Node.js
FROM node:18.20.2

# Set working directory for frontend
WORKDIR /app/frontend

# Copy frontend source code
COPY . .

# Install Angular CLI
RUN npm install -g @angular/cli

# Install dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 80

# Start the Angular development server
CMD ["ng", "serve", "--host", "0.0.0.0"]
