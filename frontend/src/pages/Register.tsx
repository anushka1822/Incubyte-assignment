import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { User, Shield, UserPlus, ArrowLeft } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // Default role
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { 
        username, 
        password,
        role // Send the selected role to backend
      });
      alert("Registration Successful! Please Login.");
      navigate('/login');
    } catch (err: any) {
      setError("Registration failed. Username might be taken.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-500" />
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div 
              onClick={() => setRole('customer')}
              className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${role === 'customer' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-500'}`}
            >
              <User size={24} />
              <span className="font-semibold text-sm">Customer</span>
            </div>
            
            <div 
              onClick={() => setRole('admin')}
              className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${role === 'admin' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-gray-300 text-gray-500'}`}
            >
              <Shield size={24} />
              <span className="font-semibold text-sm">Admin</span>
            </div>
          </div>

          {/* Inputs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              required 
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required 
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Choose a password"
            />
          </div>

          <button 
            type="submit" 
            className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2
              ${role === 'admin' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
          >
            <UserPlus size={20} />
            Sign Up as {role === 'admin' ? 'Admin' : 'Customer'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;