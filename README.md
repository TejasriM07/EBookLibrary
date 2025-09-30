# Online Book Library

Welcome to the Online Book Library, a web application built to help users discover, manage, and review books. This project allows users to search for books, add them to personal reading lists (To Be Read, Reading, Read), view their profile statistics, and more. The app is styled with a Teal Green and Gold theme for a modern and engaging user experience.

## Features
- **User Authentication**: Register and log in to personalize your experience.
- **Book Search**: Search for books using Google Books API or browse random selections.
- **Personal Book Lists**: Add books to To Be Read, Reading, or Read lists, with options to update or remove them.
- **Profile Management**: Upload a profile picture and view reading statistics on the About page.
- **Book Details**: View book details, borrow options, and add reviews in a modal.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **Sticky Footer**: Footer remains at the bottom of the screen.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)
- **APIs**: Google Books API
- **Other**: Pygame (via Pyodide for potential future games), Axios for HTTP requests

## Prerequisites
- Node.js (v14.x or later)
- npm (comes with Node.js)
- MongoDB Atlas account (for database hosting)
- Git (for version control)

## Installation

### Clone the Repository
```bash
git clone https://github.com/yourusername/online-book-library.git
cd online-book-library
```

### Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory based on `.env.example`:
   - Copy `.env.example` to `.env`.
   - Fill in your MongoDB URI and JWT secret:
     ```
     PORT=5000
     MONGO_URI=mongodb+srv://yourusername:yourpassword@cluster0.abc123.mongodb.net/booklibrary?retryWrites=true&w=majority
     JWT_SECRET=your_jwt_secret_here
     ```
4. Start the server:
   ```bash
   node server.js
   ```
   The server should run on `http://localhost:5000`.

### Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000`.

## Usage
- **Register**: Visit `/register` to create an account.
- **Login**: Use `/login` to access your personalized dashboard.
- **Home**: Explore random books or search for specific titles on the homepage (`/`).
- **Bookshelf**: Browse and add books to your lists on `/bookshelf`.
- **My Books**: Manage your To Be Read, Reading, and Read lists on `/mybooks`.
- **About**: View your profile and reading stats on `/about`.

## Screenshots

- **Homepage**:
  ![Homepage](<img width="2153" height="1244" alt="Screenshot 2025-09-21 210630" src="https://github.com/user-attachments/assets/3b53644c-6824-464a-a267-259978a62c31" />
)
  _Description: The homepage with a book search bar and random book suggestions._

- **Login Page**:
  ![Login Page](<img width="2124" height="1211" alt="image" src="https://github.com/user-attachments/assets/d4f3f03c-7a75-476e-9eac-0cb54fff9eed" />
)
  _Description: The login form with a Teal Green and Gold theme._

- **My Books Page**:
  ![My Books Page](<img width="2154" height="1227" alt="Screenshot 2025-09-21 211622" src="https://github.com/user-attachments/assets/40955f3b-b52b-4e23-ba35-34da83f5b45c" />
)
  _Description: The My Books page showing To Be Read, Reading, and Read sections._

- **About Page**:
  ![About Page](<img width="2141" height="1253" alt="image" src="https://github.com/user-attachments/assets/169c6223-ee66-4cd2-ae87-e0c95f7c60db" />
)
  _Description: The About page with profile picture and reading stats._

## Environment Variables
Sensitive information like the MongoDB URI and JWT secret should not be committed. Use the `.env` file as described in the setup. The `.env.example` file provides a template.

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make changes and commit (`git commit -m "Describe changes"`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Inspired by open-source book management projects.




