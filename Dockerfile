# Use a base image with Node.js for building frontend
FROM node:12.7.1 as frontend-builder

# Set working directory for frontend
WORKDIR /app/frontend

# Copy frontend source code
COPY frontend/package.json frontend/package-lock.json ./
COPY frontend/ ./

# Install dependencies and build frontend
RUN npm install
RUN npm run build

# Use a base image with PHP for backend
FROM php:7.4-fpm

# Set working directory for backend
WORKDIR /app/backend

# Copy backend source code
COPY backend/ .

# Install PHP dependencies
RUN apt-get update && \
    apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev zip unzip && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install gd pdo pdo_mysql

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Laravel dependencies
RUN composer install

# Expose port 9000 for serving Laravel app
EXPOSE 9000

# Start Laravel app
CMD ["php", "artisan", "serve", "--host", "0.0.0.0"]
