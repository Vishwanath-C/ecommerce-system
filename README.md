# ecommerce-system
🛒 E-Commerce App

A full-stack e-commerce application built with Spring Boot, React, and MySQL. 
It provides product browsing, shopping cart, checkout, and order management for users, and an admin panel for managing products, categories, and orders.

## Features

- User authentication using JWT
- Product and category management
- Shopping cart and checkout process
- Order tracking for users
- Admin dashboard for managing products, categories, and orders

## Tech Stack

### Backend: 
- Spring Boot
- MySQL
- Spring Security
- JPA/Hibernate
  
### Frontend: 
- React
- Material UI (MUI)
- Axios
  
### Build Tools: 
- Gradle
- Vite

### Prerequisites
- Java 17+
- Node.js (for frontend development and build)
- MySQL Server
- Gradle (for backend build)
- npm (for frontend dependencies)

  ## Setup Instructions

### Backend (Spring Boot / Gradle)
1. Navigate to the backend folder:
   ```bash
   cd backend

2. Configure the Database

    Edit `src/main/resources/application.properties` and add the following:

    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
    spring.datasource.username=root
    spring.datasource.password=yourpassword
    spring.jpa.hibernate.ddl-auto=update
    spring.jpa.show-sql=true

3. Run the backend
  ```bash
  ./gradlew bootRun

4: Verify backend
  ```Open a browser or Postman and check:
    http://localhost:8080

2. Frontend (React / Vite)

Step 1: Navigate to the frontend folder
cd frontend

Step 2: Install dependencies
npm install

Step 3: Start the development server
```npm run dev

Step 4: Verify frontend
```Open a browser and visit:
http://localhost:5173

Step 5 (Optional): Build for production
```npm run build```

- The compiled files will be in the dist/ folder.
- You can serve them via Spring Boot by copying them to:
    backend/src/main/resources/static/

  Database Setup

1. Make sure MySQL is installed and running.

2. Create a new database (example: ecommerce_db):
CREATE DATABASE ecommerce_db;

3. Update your application.properties with your username and password.

4. Tables will be created automatically on first run due to:
   spring.jpa.hibernate.ddl-auto=update

Running the App

1. Start MySQL.

2. Run the backend:
./gradlew bootRun

3. Run the frontend (development):
npm run dev

4. Open your browser at:
   http://localhost:5173



