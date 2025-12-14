import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { LogOut, ShoppingBag, Plus, X } from 'lucide-react';

interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image_url?: string;
}

const Dashboard = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [showForm, setShowForm] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '', category: '', price: '', quantity: ''
  });

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      const response = await api.get('/sweets/');
      setSweets(response.data);
    } catch (error) {
      console.error("Failed to fetch sweets", error);
    }
  };

  const handleLogout = () => {
    auth?.logout();
    navigate('/login');
  };

  const handleAddSweet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/sweets/', {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      });
      setShowForm(false);
      fetchSweets(); // Refresh list
      setFormData({ name: '', category: '', price: '', quantity: '' }); // Reset form
    } catch (error) {
      alert("Failed to add sweet. Do you have Admin permissions?");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <ShoppingBag /> Sweet Shop
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
            {auth?.userRole === 'admin' ? '👑 Admin' : '👷 Staff'}
          </span>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-1 rounded"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <main className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Inventory</h1>
          
          {/* Only Admins see the Add Button */}
          {auth?.userRole === 'admin' && (
            <button 
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              {showForm ? <X size={20}/> : <Plus size={20}/>}
              {showForm ? 'Close' : 'Add Sweet'}
            </button>
          )}
        </div>

        {/* Add Sweet Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-blue-100">
            <h2 className="text-xl font-bold mb-4">Add New Item</h2>
            <form onSubmit={handleAddSweet} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input required placeholder="Name (e.g. Chocolate Lava)" className="border p-2 rounded" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required placeholder="Category (e.g. Cake)" className="border p-2 rounded"
                value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              <input required type="number" placeholder="Price ($)" className="border p-2 rounded"
                value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              <input required type="number" placeholder="Qty" className="border p-2 rounded"
                value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
              <button className="bg-green-600 text-white p-2 rounded hover:bg-green-700 font-medium">
                Save Item
              </button>
            </form>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sweets.map((sweet) => (
            <div key={sweet.id} className="bg-white p-5 rounded-lg shadow hover:shadow-md transition border border-gray-100">
              <div className="h-40 bg-gray-100 rounded mb-4 flex items-center justify-center text-gray-400">
                <ShoppingBag size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{sweet.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{sweet.category}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-green-600 font-bold text-lg">${sweet.price}</span>
                <span className={`text-xs px-2 py-1 rounded font-medium ${sweet.quantity > 0 ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                  {sweet.quantity} left
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;