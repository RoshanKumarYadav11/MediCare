# Project Setup

This document outlines the steps to set up and run the project.

## Prerequisites

- Node.js and npm (Node Package Manager) installed.

## Installation

1.  **Install Dependencies:**

    Navigate to both the `client` and `server` directories and run the following command in each:

    ```bash
    npm install
    ```

    This will install all the necessary dependencies for the client and server applications.

2.  **Configure Environment Variables:**

    - In the `server` directory, create a `.env` file.
    - Populate the `.env` file with the required environment variables, referencing the `.env.example` file for the correct format and variable names.

    Example `.env` structure:

    ```
    MONGO_URI="your_mongodb_connection_string"
    JWT_SECRET="your_jwt_secret_key"
    LIVE_SECRET_KEY="here goes your khalti LIVE_SECRET_KEY"
    # ... other variables
    ```

    **Important:** Ensure you replace the placeholder values with your actual configuration. Keep your `JWT_SECRET` secure.

3.  **Customize Admin Credentials:**

    - Open the file `server/utils/createAdmin.js`.
    - Modify the admin user's credentials (username, password, etc.) within the script to match your desired admin account details.

4.  **Run the Project:**

    - Open two separate terminal windows or tabs.
    - In the first terminal, navigate to the `server` directory and run:

    ```bash
    npm run dev
    ```

    - In the second terminal, navigate to the `client` directory and run:

    ```bash
    npm run dev
    ```

5.  **Create Admin User:**

    - Execute the following command to create the admin user in your database:

    ```bash
    node server/utils/createAdmin.js
    ```

    This script will use the credentials you set in the previous step to create the initial admin account.

    This will start both the server and client applications in development mode. You should now be able to access the application in your web browser.
