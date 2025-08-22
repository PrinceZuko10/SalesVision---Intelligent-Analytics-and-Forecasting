import { useState } from 'react';
import axios from 'axios';
import './Signup.css';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    position: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const API_URL = import.meta.env.VITE_API_URL;

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(`${API_URL}/api/signup`, formData);
    alert(`User registered successfully! User ID: ${res.data.userId}`);
  } catch (err) {
    console.error(err);
    alert('Failed to register: ' + (err.response?.data?.message || err.message));
  }
};

  
  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl mb-4 font-bold text-red-500">Create Account</h2>
        <input name="name" placeholder="Name" onChange={handleChange} className="input-style" required />
        <input name="age" type="number" placeholder="Age" onChange={handleChange} className="input-style" required />
        <select name="gender" onChange={handleChange} className="input-style" required>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>
        <select name="position" onChange={handleChange} className="input-style" required>
          <option value="">Select Position</option>
          <option>Admin</option>
          <option>Branch Manager</option>
          <option>Store Manager</option>
        </select>
        <button type="submit" className="mt-4 bg-red-500 px-4 py-2 rounded-md">Sign Up</button>
      </form>
    </div>
  );
}
