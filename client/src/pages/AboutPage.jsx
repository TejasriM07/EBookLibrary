import { useEffect, useState } from 'react';
import { getProfile, uploadProfilePic } from '../api/api';
import { MdPerson } from 'react-icons/md';
import useAuth from '../hooks/useAuth';

const AboutPage = () => {
  const { getUserId } = useAuth();
  const userId = getUserId();
  const [profile, setProfile] = useState({});
  const [stats, setStats] = useState({ read: 0, reading: 0, tbr: 0 });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      const fetchProfile = async () => {
        try {
          setError('');
          const { data } = await getProfile(userId);
          setProfile(data);
        } catch (error) {
          setError(error.response?.data?.message || 'Error fetching profile');
        }
      };
      fetchProfile();

      const savedBooks = JSON.parse(localStorage.getItem('books') || '[]');
      const userBooks = savedBooks.filter(book => book.userId === userId);
      setStats({
        read: userBooks.filter(b => b.status === 'read').length,
        reading: userBooks.filter(b => b.status === 'reading').length,
        tbr: userBooks.filter(b => b.status === 'tbr').length,
      });
    }
  }, [userId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setError('');
      const { data } = await uploadProfilePic(userId, file);
      setProfile(data);
      setFile(null);
      alert('Profile picture updated!');
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating profile picture');
    }
  };

  if (!userId) {
    return <div className="container mx-auto p-4 text-center">Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <MdPerson className="text-3xl text-teal-600 mr-3" />
        <h1 className="text-3xl font-bold text-teal-800">My Profile</h1>
      </div>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="flex flex-col items-center">
        <div className="relative">
          <img
            src={profile.profilePic || 'https://placehold.co/150'}
            alt="Profile"
            className="w-40 h-40 rounded-full border-0.5 border-black shadow-md"
          />
          <div className="absolute bottom-0 right-0 bg-gold-500 text-white rounded-full p-2">
            <MdPerson className="text-xl" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-teal-600 mt-4">{profile.username || 'N/A'}</h2>
        <p className="text-teal-600">{profile.userType || 'N/A'}</p>
        <div className="mt-6 flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="p-2 border border-gold-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
          <button
            onClick={handleUpload}
            className="bg-gold-200 text-teal-800 py-2 px-6 rounded-lg hover:bg-gold-600 transition-colors"
          >
            Upload Profile Pic
          </button>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
          <div className="bg-gold-200 p-4 rounded-lg shadow-lg border border-gold-500">
            <h3 className="text-lg font-bold text-teal-700">Books Read</h3>
            <p className="text-2xl font-medium text-teal-800">{stats.read}</p>
          </div>
          <div className="bg-gold-200 p-4 rounded-lg shadow-lg border border-gold-500">
            <h3 className="text-lg font-bold text-teal-700">Books Reading</h3>
            <p className="text-2xl font-medium text-teal-800">{stats.reading}</p>
          </div>
          <div className="bg-gold-200 p-4 rounded-lg shadow-lg border border-gold-500">
            <h3 className="text-lg font-bold text-teal-700">Books To Read</h3>
            <p className="text-2xl font-medium text-teal-800">{stats.tbr}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;