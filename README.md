# Crown Hotel Management System

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
</p>

## About Crown Hotel

Crown Hotel Management System is a comprehensive hotel management solution built with Laravel and React. The system provides a luxurious and intuitive interface for managing all aspects of hotel operations, including:

- **User Role Management**: Support for 5 different roles (SuperAdmin, Admin, Employee, Client, and Supplier)
- **Booking Management**: Comprehensive reservation system with calendar view
- **Room Management**: Track room availability, status, and details
- **Menu & Order Management**: Food menu with availability status and order processing
- **Client Management**: Client profiles, booking history, and feedback
- **Employee Management**: Staff profiles, schedules, and attendance tracking
- **Inventory Management**: Track hotel supplies and manage purchase orders
- **Task Management**: Assign and track tasks for employees

## Features

- **Luxurious UI Design**: Consistent design pattern with elegant gradients and animations
- **Role-Based Access Control**: Different dashboards and permissions for each user role
- **Real-time Notifications**: Toast notifications for user feedback
- **Image Upload & Management**: Profile images and menu item images with preview capabilities
- **Responsive Design**: Works seamlessly across all device sizes
- **Form Validation**: Client and server-side validation for data integrity

## Installation

```bash
# Clone the repository
git clone https://github.com/YoboiiKai/CrownHotel.git

# Navigate to the project directory
cd CrownHotel

# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install

# Copy the environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Create symbolic link for storage
php artisan storage:link

# Compile assets
npm run dev
```

## Usage

Start the development server:

```bash
php artisan serve
```

Visit `http://localhost:8000` in your browser to access the application.

## License

This project is licensed under the MIT License.
