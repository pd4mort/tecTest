# TecTest

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

TecTest is a comprehensive technical test project featuring a monorepo API setup with Yarn. Utilizing Prisma, it manages user CRUD operations, authorizations, roles, and profile picture uploads to the cloud. Additionally, it includes a robust push notification system.

## Technologies Used
![Yarn](https://img.shields.io/badge/Yarn-v1.22.11-blue.svg)
![Prisma](https://img.shields.io/badge/Prisma-v3.12.0-blueviolet.svg)
![Firebase](https://img.shields.io/badge/Firebase-v9.6.0-orange.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-v4.5.4-blue.svg)

## Installation

### Prerequisites
- Node.js (version 18.20.4)
- Yarn (version 1.22.22)
- PostgreSQL (ensure PostgreSQL is installed and running)

### Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/tectest.git
    ```

2. Navigate to the project directory:
    ```bash
    cd my-monorepo
    ```

3. Install the dependencies:
    ```bash
    yarn install
    ```

4. Set up environment variables:
    - Copy the example environment files:
      ```bash
      cp api/.env.example api/.env
      cp package/db/.env.example package/db/.env
      ```

    - Edit the `.env` files with the required configuration:
      - `api/.env`:
        ```bash
        PORT="3000"
        SECRET_JWT="supersecret"
        ```
      - `package/db/.env`:
        ```bash
        DATABASE_URL="postgresql://postgres:root@localhost:5432/mydb?schema=public"
        ```

5. Generate and configure the `ServiceAccountKey.json` file:
    1. Go to the [Google Firebase Console](https://console.firebase.google.com/).
    2. Navigate to **IAM & Admin** > **Service Accounts**.
    3. Select your project.
    4. Click **Create Service Account**.
    5. Enter a name and description for the service account.
    6. Click **Create** and then **Continue**.
    7. Under **Role**, select **Project** > **Editor**, then click **Continue**.
    8. Click **Create Key**, select **JSON**, and click **Create**. This will download the `ServiceAccountKey.json` file.
    9. Place this file in the root of your project directory.
    10. For more information, refer to the [Firebase documentation](https://firebase.google.com/docs/admin/setup).

    **Example `ServiceAccountKey.json` Format** (Replace with your actual content):
    ```json
    {
      "type": "service_account",
      "project_id": "YOUR_PROJECT_ID",
      "private_key_id": "YOUR_PRIVATE_KEY_ID",
      "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
      "client_email": "YOUR_CLIENT_EMAIL",
      "client_id": "YOUR_CLIENT_ID",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/YOUR_CLIENT_EMAIL",
      "universe_domain": "googleapis.com"
    }
    ```

    **Note:** Be sure to replace all placeholders with your actual Firebase credentials.

6. Generate and migrate the Prisma database schema:
    ```bash
    cd packages/db
    yarn generate
    yarn migrate
    ```

## Usage

### Development Mode
The application is currently in development mode and is not built for production. To run the application, use the following commands:

1. **Start the API server:**
   ```bash
   yarn workspace api dev
   
2. Start the WebSocket client for push notifications:
   Ensure you have Node.js installed, then run the WebSocket client script:
   ```bash
   node my-monorepo/testWebSocketClient.js

## API Endpoints

Below are the available endpoints for the API:

### Users

- **Get all users:** `GET http://localhost:3000/api/users`
- **Get a user by ID:** `GET http://localhost:3000/api/users/:id`
- **Register a new user:** `POST http://localhost:3000/api/register`
- **Login:** `POST http://localhost:3000/api/login`
- **Create a new user:** `POST http://localhost:3000/api/users`
- **Update a user:** `PUT http://localhost:3000/api/users/:id`
- **Delete a user:** `DELETE http://localhost:3000/api/users/:id`
- **Upload profile picture:** `POST http://localhost:3000/api/user/upload-profile-picture`

### Posts

- **Get all posts:** `GET http://localhost:3000/api/posts`
- **Get a post by ID:** `GET http://localhost:3000/api/posts/:id`
- **Create a new post:** `POST http://localhost:3000/api/posts`
- **Update a post:** `PUT http://localhost:3000/api/posts/:id`
- **Delete a post:** `DELETE http://localhost:3000/api/posts/:id`

## Authentication

The API uses JWT (JSON Web Token) for authentication. You must include a valid JWT in the Authorization header of your requests. Depending on the user's role, different permissions are granted:

**Roles:**

- **God:** Full access to all resources.
- **Admin:** Limited access to update profile pictures and posts created by the user.
- **User:** Can only update their own profile picture and posts they have created.

## Swagger Documentation

Swagger is integrated for API documentation. You can access it at:

      ```bash
      http://localhost:3000/docs

Example Postman Collection
A Postman collection for testing the API is provided in the project directory alongside the README.md file. You can import this collection into Postman for easy testing.

WebSocket Client Example
To test the WebSocket notifications, use the following client script located in my-monorepo/testWebSocketClient.js
   ```bash
   node testWebSocketClient.js

