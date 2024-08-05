# TecTest

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

TecTest is a comprehensive technical test project featuring a monorepo API setup with Yarn. Utilizing Prisma, it manages user CRUD operations, authorizations, roles, and profile picture uploads to the cloud. Additionally, it includes a robust push notification system.

## Table of Contents
1. [Installation](#installation)
2. [Usage](#usage)
3. [Configuration](#configuration)
4. [Contributing](#contributing)
5. [License](#license)
6. [Credits](#credits)

## Technologies Used
![Yarn](https://img.shields.io/badge/Yarn-v1.22.11-blue.svg)
![Prisma](https://img.shields.io/badge/Prisma-v3.12.0-blueviolet.svg)
![Firebase](https://img.shields.io/badge/Firebase-v9.6.0-orange.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-v4.5.4-blue.svg)

## Installation

### Prerequisites
- Node.js (version 18.20.4)
- Yarn (version 1.22.22)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tectest.git
   
2. Clone the repository:
   ```bash
   cd my-monorepo

4. Clone the repository:
   ```bash
   yarn install

 5. Set up environment variables:

    Copy the example environment files:
    ```bash
      cp api/.env.example api/.env
      cp package/db/.env.example package/db/.env
  
    Edit the .env files with the required configuration:
      ```bash
      PORT="3000"
      SECRET_JWT="supersecret"
  
    package/db/.env:
      DATABASE_URL="postgresql://postgres:root@localhost:5432/mydb?sch

  6. Generate and configure the `ServiceAccountKey.json` file:
    1. Go to the [Google Cloud Console](https://console.firebase.google.com/).
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

     





