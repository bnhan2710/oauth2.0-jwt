# JWT Authentication and authorization App
    JWT Authentication App is a full-stack web application that uses 'React' for the frontend and 'Node.js/Express' for the backend
## Installation

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 19.x or higher recommended)
- [npm](https://www.npmjs.com/) (Node package manager)

### Backend Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/bnhan2710/auth0-jwt.git
    cd auth0-jwt
    ```

2. Navigate to the backend directory and install dependencies:

    ```bash
    cd backend
    npm install
    ```

3. Create a `.env` file in the `backend` directory and add your environment variables:

    ```env
    PORT=8000
    DB_URI=mongodb://localhost:27017/mydatabase
    JWT_ACCESS_KEY=your_jwt_secret
    JWT_REFRESH_KEY=your_jwt_secret
    EMAIL = your_email
    EMAIL_PASSWORD = your_email_app_password

    GOOGLE_CLIENT_ID = your_google_client_id
    GOOGLE_CLIENT_SECRET = your_google_client_secret
    FACEBOOK_CLIENT_ID = your_fb_client_id
    FACEBOOK_CLIENT_SECRET = your_fb_client_secret
    COOKIE_KEY = your_cookie_key
    ```

4. Start the backend server:

    ```bash
    npm start
    ```

### Frontend Setup

1. Navigate to the frontend directory and install dependencies:

    ```bash
    cd ../frontend
    npm install
    ```

2. Start the frontend development server:

    ```bash
    npm start
    ```
   
## Usage

1. Ensure both the backend and frontend servers are running.
2. Open your browser and navigate to `http://localhost:3000`.
