## Full Stack Open Part 4: Express Backend with Unit Testing, MongoDB, and Mongoose

**Description:**

This project showcases a backend server built using Node.js and Express, with a MongoDB database for data storage and Mongoose for defining schemas and validation. It includes essential features like user creation, login services, and token authentication. To ensure code quality and reliability, unit testing is implemented using Vitest.

**Key Features:**

- **Express Backend:** A Node.js server built with the Express framework.
- **MongoDB Database:** Stores user data and other relevant information.
- **Mongoose:** A MongoDB object modeling tool for defining schemas and validation rules.
- **User Management:** Handles user creation, login, and authentication.
- **Token Authentication:** Implements JWT-based authentication for secure API access.
- **Unit Testing:** Uses Vitest for comprehensive unit testing coverage.

**Installation:**

1. **Clone the repository:** `git clone https://github.com/yourusername/full-stack-open-part-4.git`
2. **Install dependencies:** `cd full-stack-open-part-4 && npm install`

**Configuration:**

**Environment Variables:**

Create a `.env` file in the project root directory and set the following environment variables:

- `JWT_SECRET`: A secret key for generating JSON Web Tokens.
- `MONGODB_URI`: The connection string for your MongoDB database.
- `PORT`: The port number for the backend server to listen on (default: 3001).

**Running the Backend:**

1. **Start the development server:** `npm start`

**Testing:**

- **Run unit tests:** `npm run test`

**Technologies Used:**

- Node.js
- Express
- Vitest
- MongoDB
- Mongoose

**Contributing:**

Feel free to contribute to the project by submitting pull requests or opening issues. Please adhere to the project's coding standards and best practices.
