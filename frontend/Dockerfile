# Use a base image with Node.js 21.7.1
FROM node:18.20.2 as frontend-builder

# Set working directory for frontend
WORKDIR /app/frontend

# Copy frontend source code
COPY . .

# Install Angular CLI
RUN npm install -g @angular/cli

# Install dependencies
RUN npm install

# Build the frontend application
RUN ng build --configuration=production

# Use a lightweight Node.js image for serving the frontend
FROM nginx:alpine

# Copy built frontend assets from previous stage
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80
# Start the Angular development server
CMD ["ng", "serve", "--host", "0.0.0.0"]
