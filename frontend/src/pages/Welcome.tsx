import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-6 text-center">
      
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-2xl w-full border border-blue-50">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <ShoppingBag className="w-16 h-16 text-blue-600" />
          </div>
        </div>

        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Sweet Shop <span className="text-blue-600">Manager</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed">
          Manage your inventory, track sales, and delight your customers with the best sweets in town.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/login" 
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-200"
          >
            Login
            <ArrowRight size={20} />
          </Link>
          
          <Link 
            to="/register" 
            className="flex items-center justify-center gap-2 bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            Register
          </Link>
        </div>
      </div>

      <p className="mt-8 text-gray-500 text-sm">
        © 2025 Sweet Shop Inc. All rights reserved.
      </p>
    </div>
  );
};

export default Welcome;