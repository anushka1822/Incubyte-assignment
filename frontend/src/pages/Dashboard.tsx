import { useEffect, useState, useContext } from 'react';

import { useNavigate } from 'react-router-dom';

import api from '../services/api';

import { AuthContext } from '../context/AuthContext';

import { 

  LogOut, ShoppingBag, Plus, X, Trash2, Pencil, 

  Search, ShoppingCart, PackagePlus, ChefHat, Filter, Circle, Loader2 

} from 'lucide-react';



const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60";



interface Sweet {

  id: number;

  name: string;

  category: string;

  price: number;

  quantity: number;

  image_url?: string;

  is_veg: boolean;

}



const Dashboard = () => {

  const [sweets, setSweets] = useState<Sweet[]>([]); // Master List (Source of Truth)

  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]); // View List (What user sees)

  const [showForm, setShowForm] = useState(false);

  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('All');

  

  // Loading States

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [buyingId, setBuyingId] = useState<number | null>(null);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [restockingId, setRestockingId] = useState<number | null>(null);

  

  const auth = useContext(AuthContext);

  const navigate = useNavigate();



  const [formData, setFormData] = useState({

    name: '', category: '', price: '', quantity: '', is_veg: true

  });



  // Calculate categories from the MASTER list, not the filtered one

  const categories = ['All', ...new Set(sweets.map(s => s.category))];



  // 1. Initial Load Only

  useEffect(() => {

    if (!auth?.token) navigate('/');

    fetchSweets();

  }, [auth, navigate]);



  // 2. Intelligent Filtering Effect

  useEffect(() => {

    const applyFilters = async () => {

      let results: Sweet[] = [];



      if (searchQuery) {

        // A. Server-Side Search

        try {

          const response = await api.get(`/sweets/search?name=${searchQuery}`);

          results = response.data;

        } catch (error) {

          console.error("Search failed", error);

          results = []; 

        }

      } else {

        // B. Client-Side: Use Master List

        results = [...sweets];

      }



      // C. Apply Category Filter (Client-Side)

      if (selectedCategory !== 'All') {

        results = results.filter(s => s.category === selectedCategory);

      }



      // D. Update the View

      setFilteredSweets(results);

    };



    const timer = setTimeout(applyFilters, 300); // Debounce typing

    return () => clearTimeout(timer);

  }, [searchQuery, selectedCategory, sweets]); // Re-run if any of these change



  const fetchSweets = async () => {

    try {

      const response = await api.get('/sweets/');

      setSweets(response.data);        // Update Master

      setFilteredSweets(response.data); // Update View

    } catch (error) { console.error("Failed to fetch", error); }

  };



  const handleLogout = () => {

    auth?.logout();

    navigate('/');

  };



  // --- ACTIONS ---



  const handleDelete = async (id: number) => {

    if (!confirm("Are you sure?")) return;

    setDeletingId(id);

    try {

      await api.delete(`/sweets/${id}`);

      fetchSweets(); // Refresh Master List

    } catch (error) { alert("Delete failed."); }

    finally { setDeletingId(null); }

  };



  const handleEditClick = (sweet: Sweet) => {

    setEditingSweet(sweet);

    setFormData({

      name: sweet.name,

      category: sweet.category,

      price: sweet.price.toString(),

      quantity: sweet.quantity.toString(),

      is_veg: sweet.is_veg

    });

    setShowForm(true);

    window.scrollTo({ top: 0, behavior: 'smooth' });

  };



  const handlePurchase = async (id: number) => {

    setBuyingId(id);

    try {

      await api.post(`/sweets/${id}/purchase`, { amount: 1 });

      fetchSweets(); // Refresh Master List

    } catch (error) { alert("Purchase failed."); }

    finally { setBuyingId(null); }

  };



  const handleRestock = async (id: number) => {

    const amount = parseInt(prompt("How many items to add?") || "0");

    if (!amount) return;

    

    setRestockingId(id);

    try {

      await api.post(`/sweets/${id}/restock`, { amount });

      fetchSweets(); // Refresh Master List

    } catch (error) { alert("Restock failed."); }

    finally { setRestockingId(null); }

  };



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setIsSubmitting(true);

    try {

      const payload = {

        ...formData,

        price: parseFloat(formData.price),

        quantity: parseInt(formData.quantity)

      };

      if (editingSweet) await api.put(`/sweets/${editingSweet.id}`, payload);

      else await api.post('/sweets/', payload);

      

      setShowForm(false);

      setEditingSweet(null);

      setFormData({ name: '', category: '', price: '', quantity: '', is_veg: true });

      fetchSweets(); // Refresh Master List

    } catch (error) { alert("Operation failed."); }

    finally { setIsSubmitting(false); }

  };



  return (

    <div className="min-h-screen bg-gray-50/50 font-sans selection:bg-indigo-100 selection:text-indigo-800">

      

      <style>{`

        @keyframes slideUp {

          from { opacity: 0; transform: translateY(20px); }

          to { opacity: 1; transform: translateY(0); }

        }

        .animate-slide-up { animation: slideUp 0.6s ease-out forwards; }

        .delay-100 { animation-delay: 0.1s; }

        .delay-200 { animation-delay: 0.2s; }

      `}</style>



      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-sm transition-all duration-300">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex justify-between items-center h-20">

            

            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.reload()}>

              <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform duration-300">

                <ShoppingBag className="text-white w-6 h-6" strokeWidth={2.5} />

              </div>

              <div>

                <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">

                  SweetShop

                </h1>

              </div>

            </div>



            <div className="hidden md:flex flex-1 max-w-lg mx-8 relative group">

              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">

                <Search className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />

              </div>

              <input 

                placeholder="Find your favorite treat..." 

                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-100/50 border-transparent focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50/50 transition-all duration-300 outline-none text-gray-700 placeholder-gray-400 font-medium"

                value={searchQuery}

                onChange={(e) => setSearchQuery(e.target.value)}

              />

            </div>



            <div className="flex items-center gap-4">

              <div className={`hidden sm:flex flex-col items-end px-4 py-1.5 rounded-xl border ${auth?.userRole === 'admin' ? 'bg-purple-50 border-purple-100' : 'bg-blue-50 border-blue-100'}`}>

                <span className={`text-[10px] font-bold uppercase tracking-wider ${auth?.userRole === 'admin' ? 'text-purple-600' : 'text-blue-600'}`}>

                  Logged in as

                </span>

                <span className="text-sm font-bold text-gray-800 capitalize leading-none">

                  {auth?.userRole}

                </span>

              </div>

              

              <button 

                onClick={handleLogout} 

                className="p-2.5 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"

                title="Logout"

              >

                <LogOut size={22} strokeWidth={2} />

              </button>

            </div>

          </div>

        </div>

      </nav>



      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 animate-slide-up">

          <div>

            <h2 className="text-4xl font-black text-gray-800 mb-2 flex items-center gap-3">

              Inventory <span className="text-gray-300 font-light text-2xl">|</span> 

              <span className="text-2xl text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-lg">

                {filteredSweets.length} Items

              </span>

            </h2>

            <p className="text-gray-500 font-medium">Manage your bakery items and track stock levels in real-time.</p>

          </div>



          {auth?.userRole === 'admin' && (

            <button 

              onClick={() => { setShowForm(!showForm); setEditingSweet(null); setFormData({ name: '', category: '', price: '', quantity: '', is_veg: true }); }}

              className="group bg-gray-900 text-white px-6 py-3.5 rounded-2xl flex items-center gap-3 hover:bg-gray-800 shadow-xl shadow-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 font-semibold"

            >

              {showForm ? <X size={20}/> : <Plus size={20}/>}

              {showForm ? 'Close Editor' : 'Add New Item'}

            </button>

          )}

        </div>



        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showForm ? 'max-h-[800px] opacity-100 mb-10' : 'max-h-0 opacity-0'}`}>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100/50 relative overflow-hidden">

            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>

            

            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">

              <ChefHat className="text-indigo-500" />

              {editingSweet ? 'Edit Item Details' : 'Create New Item'}

            </h3>

            

            <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">

              <div className="lg:col-span-2 space-y-2">

                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Item Name</label>

                <input required className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium" 

                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Red Velvet Cake"/>

              </div>

              <div className="lg:col-span-1 space-y-2">

                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Category</label>

                <input required className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"

                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Cake"/>

              </div>

              <div className="lg:col-span-1 space-y-2">

                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Price ($)</label>

                <input required type="number" className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-gray-700"

                  value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />

              </div>

              <div className="lg:col-span-1 space-y-2">

                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Stock</label>

                <input required type="number" className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-gray-700"

                  value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />

              </div>

              

              <div className="lg:col-span-1 flex flex-col justify-end pb-2">

                <div 

                  onClick={() => setFormData({...formData, is_veg: !formData.is_veg})}

                  className={`cursor-pointer p-1 rounded-full flex items-center transition-colors duration-300 border-2 ${formData.is_veg ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}

                >

                  <div className={`w-10 h-10 rounded-full shadow-sm flex items-center justify-center font-bold text-[10px] transform transition-transform duration-300 ${formData.is_veg ? 'translate-x-full bg-green-500 text-white' : 'bg-red-500 text-white'}`}>

                    {formData.is_veg ? 'VEG' : 'NON'}

                  </div>

                </div>

              </div>



              <div className="lg:col-span-6 flex justify-end pt-4 border-t border-gray-100">

                <button 

                  disabled={isSubmitting}

                  className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"

                >

                  {isSubmitting ? (

                    <>

                      <Loader2 className="animate-spin" size={20} />

                      {editingSweet ? 'Updating...' : 'Saving...'}

                    </>

                  ) : (

                    editingSweet ? 'Update Item' : 'Save to Inventory'

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>



        <div className="flex gap-3 mb-8 overflow-x-auto pb-4 scrollbar-hide animate-slide-up delay-100">

          <div className="flex items-center gap-2 text-gray-400 font-medium mr-2">

            <Filter size={18} />

            <span>Filters:</span>

          </div>

          {categories.map((cat) => (

            <button

              key={cat}

              onClick={() => setSelectedCategory(cat)}

              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all duration-300 border ${

                selectedCategory === cat 

                  ? 'bg-gray-900 text-white border-gray-900 shadow-md transform scale-105' 

                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'

              }`}

            >

              {cat}

            </button>

          ))}

        </div>



        {filteredSweets.length === 0 ? (

          <div className="text-center py-20 animate-slide-up">

            <p className="text-gray-400 text-lg">No sweets found matching your criteria 🍪</p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-slide-up delay-200">

            {filteredSweets.map((sweet) => (

              <div key={sweet.id} className="group bg-white rounded-3xl p-3 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-500 border border-gray-100 flex flex-col hover:-translate-y-2">

                

                <div className="h-56 rounded-2xl overflow-hidden relative isolate">

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 z-10"></div>

                  <img 

                    src={sweet.image_url || DEFAULT_IMAGE} 

                    alt={sweet.name} 

                    className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${sweet.quantity === 0 ? 'grayscale' : ''}`}

                    onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}

                  />

                  

                  <div className="absolute top-3 left-3 z-20 flex gap-2">

                    <div className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg ${sweet.is_veg ? 'bg-green-500/90' : 'bg-red-500/90'}`}>

                      <Circle size={12} fill="white" className="text-white" />

                    </div>

                  </div>



                  <div className="absolute bottom-3 left-3 z-20">

                    <p className="text-xs font-bold text-white/80 uppercase tracking-wider mb-0.5">{sweet.category}</p>

                    <h3 className="text-xl font-bold text-white leading-tight shadow-black drop-shadow-md">{sweet.name}</h3>

                  </div>



                  {sweet.quantity === 0 && (

                    <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">

                      <span className="text-white font-black text-2xl tracking-widest border-4 border-white px-4 py-2 rotate-[-12deg]">SOLD OUT</span>

                    </div>

                  )}



                  {auth?.userRole === 'admin' && (

                    <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">

                      <button 

                        onClick={() => handleRestock(sweet.id)} 

                        disabled={restockingId === sweet.id}

                        className="p-2 bg-white/90 backdrop-blur text-green-600 rounded-lg hover:bg-green-500 hover:text-white shadow-lg transition-colors flex items-center justify-center" 

                        title="Restock"

                      >

                        {restockingId === sweet.id ? <Loader2 className="animate-spin" size={18} /> : <PackagePlus size={18} />}

                      </button>

                      

                      <button onClick={() => handleEditClick(sweet)} className="p-2 bg-white/90 backdrop-blur text-amber-500 rounded-lg hover:bg-amber-500 hover:text-white shadow-lg transition-colors" title="Edit">

                        <Pencil size={18} />

                      </button>

                      

                      <button 

                        onClick={() => handleDelete(sweet.id)} 

                        disabled={deletingId === sweet.id}

                        className="p-2 bg-white/90 backdrop-blur text-red-500 rounded-lg hover:bg-red-500 hover:text-white shadow-lg transition-colors flex items-center justify-center" 

                        title="Delete"

                      >

                        {deletingId === sweet.id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}

                      </button>

                    </div>

                  )}

                </div>

                

                <div className="p-4 flex flex-col flex-1">

                  <div className="mt-auto flex items-center justify-between">

                    <div>

                      <p className="text-sm text-gray-400 font-medium">Price</p>

                      <span className="text-2xl font-black text-gray-800">${sweet.price}</span>

                    </div>

                    

                    <button 

                      onClick={() => handlePurchase(sweet.id)}

                      disabled={sweet.quantity === 0 || buyingId === sweet.id}

                      className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg

                        ${sweet.quantity > 0 

                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-110 active:scale-95 shadow-indigo-200' 

                          : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}

                    >

                      {buyingId === sweet.id ? (

                        <Loader2 className="animate-spin" size={22} />

                      ) : (

                        <ShoppingCart size={22} fill={sweet.quantity > 0 ? "currentColor" : "none"} />

                      )}

                    </button>

                  </div>

                  

                  <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center text-xs font-bold text-gray-400">

                    <span className={`${sweet.quantity < 5 && sweet.quantity > 0 ? 'text-red-500' : 'text-gray-400'}`}>

                      {sweet.quantity} items left

                    </span>

                    <span>ID: #{sweet.id}</span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>

  );

};


export default Dashboard;