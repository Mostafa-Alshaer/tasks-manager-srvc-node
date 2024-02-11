# Tasks Manager Service (Node.js)

Welcome to the Tasks Manager Service repository! This project is a Node.js implementation of a service for managing tasks.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)

## Overview

The Tasks Manager Service is a backend service built using Node.js, designed to handle task management functionalities. This project emphasizes modularity, scalability, and maintainability, making it suitable for integration into larger distributed systems.

## Features

- **Task CRUD Operations:** Perform Create, Read, Update, and Delete operations on tasks.
- **Express.js Framework:** Utilizes Express.js to handle routing and HTTP requests.
- **MongoDB Integration:** Stores task data in a MongoDB database for persistence.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose (MongoDB ORM)

## Getting Started

To run the Tasks Manager Service locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Mostafa-Alshaer/tasks-manager-srvc-node-soa.git
   ```

2. Install dependencies:
   ```bash
   cd tasks-manager-srvc-node-soa
   npm install
   ```

3. Set up a MongoDB database and update the configuration (if needed) in `.env`.

4. Run the service:
   ```bash
   npm start
   ```

The service will be accessible at `http://localhost:3000`.

## Usage

- **Example Requests:**
  - Create Task:
    ```bash
    curl -X POST http://localhost:3000/tasks -d '{"title": "Task Title", "description": "Task Description"}' -H 'Content-Type: application/json'
    ```

  - Get Many Tasks:
    ```bash
    curl http://localhost:3000/tasks
    ```

## Contributing

Contributions are welcome! Feel free to open issues, submit pull requests, or suggest improvements.
