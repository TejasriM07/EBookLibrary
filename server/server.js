const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

// Allow CORS from the deployed Netlify site and local dev (React default at localhost:3000).
// Also allow any Netlify subdomain (useful for previews) by matching '*.netlify.app'.
const allowedOrigins = [
	'https://ebooklibrary-tors.onrender.com',
	'http://localhost:3000',
	'https://ebooklib.netlify.app',
];
app.use(cors({
	origin: function (origin, callback) {
		// allow requests with no origin (like mobile apps or curl)
		if (!origin) return callback(null, true);
		// Allow exact matches or any netlify.app subdomain
		if (allowedOrigins.indexOf(origin) !== -1 || /\.netlify\.app$/.test(origin)) {
			return callback(null, true);
		}
		const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
		return callback(new Error(msg), false);
	}
}));

app.use(express.json());

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));