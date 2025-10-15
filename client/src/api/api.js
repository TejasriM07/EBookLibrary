import axios from 'axios';

// Determine base URL from environment variable when provided, otherwise use relative '/api'.
// In production set REACT_APP_API_URL to your backend root (for example: https://ebooklibrary-tors.onrender.com)
// During development you can use CRA proxy or set REACT_APP_API_URL to your local backend (e.g. http://localhost:<PORT>)
const rawApiRoot = process.env.REACT_APP_API_URL;
const apiRoot = rawApiRoot ? rawApiRoot.replace(/\/+$/, '') : '';
const baseURL = apiRoot ? `${apiRoot}/api` : '/api';
const API = axios.create({ baseURL });


// Add interceptor for backend auth
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Fetch books from Open Library by search term (title/name)
export const searchBooksFromGoogle = async (searchTerm) => {
  try {
    const q = encodeURIComponent(searchTerm);
    const response = await axios.get(`https://openlibrary.org/search.json?title=${q}&limit=10`);
    if (response.data && response.data.docs) {
      return response.data.docs.map(doc => {
        const title = doc.title || 'Unknown Title';
        const author = doc.author_name ? doc.author_name.join(', ') : 'Unknown Author';
        const genre = doc.subject ? doc.subject[0] : 'Unknown Genre';
        const description = doc.first_sentence ? (typeof doc.first_sentence === 'string' ? doc.first_sentence : (doc.first_sentence.join ? doc.first_sentence.join(' ') : '')) : (doc.subtitle || 'No description available.');
        const isbn = doc.isbn ? doc.isbn[0] : null;
        const publicationYear = doc.first_publish_year || null;
        const coverImage = doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : 'https://placehold.co/200x300';
        const openLibraryId = doc.key || null; // e.g. /works/OL12345W

        return {
          title,
          author,
          genre,
          description,
          isbn,
          publicationYear,
          coverImage,
          // keep field name used by UI for compatibility
          googleBooksId: openLibraryId,
          averageRating: null,
          purchaseOptions: [],
        };
      });
    } else {
      throw new Error('No books found');
    }
  } catch (error) {
    throw new Error('Error searching books');
  }
};

// Fetch random/popular books (with startIndex for variety)
export const fetchRandomBooksFromGoogle = async (maxResults = 6) => {
  // Use Open Library subject endpoint to fetch popular/fiction works
  const offset = Math.floor(Math.random() * 500); // random offset for variety
  try {
    const response = await axios.get(`https://openlibrary.org/subjects/fiction.json?limit=${maxResults}&offset=${offset}`);
    if (response.data && response.data.works) {
      return response.data.works.map(work => {
        const title = work.title || 'Unknown Title';
        const author = work.authors && work.authors.length ? work.authors.map(a => a.name).join(', ') : 'Unknown Author';
        const genre = work.subject ? work.subject[0] : 'Unknown Genre';
        const description = work.description ? (typeof work.description === 'string' ? work.description : (work.description.value || 'No description available.')) : 'No description available.';
        const isbn = work.cover_edition_key || null; // not exact ISBN but an identifier
        const publicationYear = work.first_publish_year || null;
        const coverImage = work.cover_id ? `https://covers.openlibrary.org/b/id/${work.cover_id}-M.jpg` : 'https://placehold.co/200x300';
        const openLibraryId = work.key || null; // e.g. /works/OL12345W

        return {
          title,
          author,
          genre,
          description,
          isbn,
          publicationYear,
          coverImage,
          googleBooksId: openLibraryId,
          averageRating: null,
          purchaseOptions: [],
        };
      });
    } else {
      throw new Error('No books found');
    }
  } catch (error) {
    throw new Error('Error fetching random books');
  }
};

// Auth and User Profile functions
export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);
export const getProfile = (userId) => API.get(`/users/${userId}/profile`);
export const uploadProfilePic = async (userId, file) => {
  const formData = new FormData();
  formData.append('profilePic', file);
  return API.put(`/users/${userId}/profile`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Delete user account and related data
export const deleteAccount = (userId) => API.delete(`/users/${userId}`);

// exported earlier: deleteAccount