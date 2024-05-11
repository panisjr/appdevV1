# Use an official PHP image as base
FROM php:8.2.12-fpm

# Set working directory for backend
WORKDIR /app/backend

# Copy backend source code
COPY . .

# Install PHP dependencies
RUN apt-get update && \
    apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev zip unzip && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install gd pdo pdo_mysql

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Laravel dependencies
RUN composer install

# Expose port 8000 for serving the Laravel app
EXPOSE 8000

# Start Laravel app
CMD ["php", "artisan", "serve", "--host", "0.0.0.0"]
