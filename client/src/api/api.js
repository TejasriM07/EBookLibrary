import axios from 'axios';

// Determine base URL from environment variable when provided, otherwise use relative '/api'.
// In production set REACT_APP_API_URL to your backend root (for example: https://ebooklibrary-tors.onrender.com)
// During development you can use CRA proxy or set REACT_APP_API_URL to http://localhost:5000
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

// Fetch books from Google by search term (title/name)
export const searchBooksFromGoogle = async (searchTerm) => {
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=intitle:${searchTerm}&maxResults=10`);
    if (response.data.items) {
      return response.data.items.map(item => {
        const volumeInfo = item.volumeInfo;
        const saleInfo = item.saleInfo;
        return {
          title: volumeInfo.title || 'Unknown Title',
          author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
          genre: volumeInfo.categories ? volumeInfo.categories[0] : 'Unknown Genre',
          description: volumeInfo.description || 'No description available.',
          isbn: volumeInfo.industryIdentifiers ? volumeInfo.industryIdentifiers[0]?.identifier : null,
          publicationYear: volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate).getFullYear() : null,
          coverImage: volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : 'https://placehold.co/200x300',
          googleBooksId: item.id,
          averageRating: volumeInfo.averageRating || null,
          purchaseOptions: saleInfo.buyLink ? [{ platform: 'Google Books', url: saleInfo.buyLink, price: saleInfo.listPrice ? saleInfo.listPrice.amount : 0 }] : [],
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
  const startIndex = Math.floor(Math.random() * 100); // Random start for variety
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=subject:fiction&startIndex=${startIndex}&maxResults=${maxResults}`);
    if (response.data.items) {
      return response.data.items.map(item => {
        const volumeInfo = item.volumeInfo;
        const saleInfo = item.saleInfo;
        return {
          title: volumeInfo.title || 'Unknown Title',
          author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
          genre: volumeInfo.categories ? volumeInfo.categories[0] : 'Unknown Genre',
          description: volumeInfo.description || 'No description available.',
          isbn: volumeInfo.industryIdentifiers ? volumeInfo.industryIdentifiers[0]?.identifier : null,
          publicationYear: volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate).getFullYear() : null,
          coverImage: volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : 'https://placehold.co/200x300',
          googleBooksId: item.id,
          averageRating: volumeInfo.averageRating || null,
          purchaseOptions: saleInfo.buyLink ? [{ platform: 'Google Books', url: saleInfo.buyLink, price: saleInfo.listPrice ? saleInfo.listPrice.amount : 0 }] : [],
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

export const SearchBooksFromGoogle = async (searchTerm) => { /* ... */ };
export const FetchRandomBooksFromGoogle = async (maxResults = 6) => { /* ... */ };