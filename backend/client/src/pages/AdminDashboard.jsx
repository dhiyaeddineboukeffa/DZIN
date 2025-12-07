import React, { useState, useEffect } from 'react';
import { Package, Plus, Trash2, Search, Filter, ShoppingBag, Truck, Tag, LayoutGrid, Edit2, X, Save } from 'lucide-react';
import { api } from '../services/api';
import Button from '../components/Button';
import ConfirmModal from '../components/ConfirmModal';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('drops');
    const [isLoading, setIsLoading] = useState(false);

    // Drops State
    const [products, setProducts] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'Streetwear',
        price: '',
        discountPrice: '',
        image: '',
        description: '',
        sizes: 'S,M,L,XL',
        inStock: true,
        featured: false
    });

    // Orders State
    const [orders, setOrders] = useState([]);
    const [editingOrder, setEditingOrder] = useState(null);
    const [editOrderData, setEditOrderData] = useState(null);

    // Wilayas State
    const [wilayas, setWilayas] = useState([]);
    const [newWilaya, setNewWilaya] = useState({ code: '', name: '', deliveryFee: 500, communes: '' });

    // Coupons State
    const [coupons, setCoupons] = useState([]);
    const [newCoupon, setNewCoupon] = useState({ code: '', discountPercentage: '' });

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: null });

    const loadData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'drops') {
                const data = await api.getProducts();
                setProducts(data);
            } else if (activeTab === 'orders') {
                const data = await api.getOrders();
                setOrders(data);
            } else if (activeTab === 'shipment') {
                const data = await api.getWilayas();
                setWilayas(data);
            } else if (activeTab === 'extra') {
                const data = await api.getCoupons();
                setCoupons(data);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [activeTab]);

    // --- Generic Delete Handler ---
    const confirmDelete = (message, deleteAction) => {
        setConfirmModal({
            show: true,
            message,
            onConfirm: async () => {
                try {
                    await deleteAction();
                    setConfirmModal({ show: false, message: '', onConfirm: null });
                    loadData();
                } catch (error) {
                    console.error('Delete failed:', error);
                    alert(`Delete failed: ${error.message}`);
                    setConfirmModal({ show: false, message: '', onConfirm: null });
                }
            }
        });
    };

    // --- Drops Handlers ---
    const handleDeleteProduct = (id) => {
        confirmDelete('Are you sure you want to delete this product?', () => api.deleteProduct(id));
    };

    const handleToggleStock = async (product) => {
        try {
            await api.updateProduct(product._id, { inStock: !product.inStock });
            loadData();
        } catch (error) {
            alert('Failed to update stock status');
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(newProduct).forEach(key => {
                if (key === 'images') {
                    // Split by newlines or commas
                    const imagesArray = newProduct[key].split(/[\n,]+/).map(url => url.trim()).filter(url => url.length > 0);
                    formData.append('images', JSON.stringify(imagesArray));
                } else if (key === 'image') {
                    // Skip 'image' as it's derived from images
                } else {
                    formData.append(key, newProduct[key]);
                }
            });
            await api.createProduct(newProduct);
            setShowAddModal(false);
            setNewProduct({
                name: '', category: 'Streetwear', price: '', discountPrice: '',
                image: '', description: '', sizes: 'S,M,L,XL', inStock: true, featured: false
            });
            loadData();
        } catch (error) {
            alert('Failed to create product');
        }
    };

    // --- Orders Handlers ---
    const handleDeleteOrder = (id) => {
        confirmDelete('Are you sure you want to delete this order?', () => api.deleteOrder(id));
    };

    const startEditOrder = (order) => {
        setEditingOrder(order);
        setEditOrderData({ ...order });
    };

    const saveOrderEdit = async () => {
        try {
            await api.updateOrder(editingOrder._id, editOrderData);
            setEditingOrder(null);
            setEditOrderData(null);
            loadData();
        } catch (error) {
            alert('Failed to update order');
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.updateOrder(orderId, { status: newStatus });
            loadData();
        } catch (error) {
            alert('Failed to update order status');
        }
    };

    // --- Wilayas Handlers ---
    const handleAddWilaya = async (e) => {
        e.preventDefault();
        try {
            await api.addWilaya({
                ...newWilaya,
                code: Number(newWilaya.code),
                deliveryFee: Number(newWilaya.deliveryFee),
                communes: newWilaya.communes.split(',').map(c => c.trim())
            });
            setNewWilaya({ code: '', name: '', deliveryFee: 500, communes: '' });
            loadData();
        } catch (error) {
            alert('Failed to add wilaya');
        }
    };

    const handleDeleteWilaya = (id) => {
        confirmDelete('Are you sure you want to delete this wilaya?', () => api.deleteWilaya(id));
    };

    // --- Coupons Handlers ---
    const handleAddCoupon = async (e) => {
        e.preventDefault();
        try {
            await api.createCoupon(newCoupon);
            setNewCoupon({ code: '', discountPercentage: '' });
            loadData();
        } catch (error) {
            alert('Failed to create coupon');
        }
    };

    const handleDeleteCoupon = (id) => {
        confirmDelete('Are you sure you want to delete this coupon?', () => api.deleteCoupon(id));
    };

    // --- Render Functions ---

    const renderSidebar = () => (
        <div className="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 h-screen fixed left-0 top-0 p-6">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                    <span className="text-white dark:text-black font-bold text-xs">DZ</span>
                </div>
                <h1 className="text-xl font-bold tracking-tighter">ADMIN</h1>
            </div>

            <nav className="space-y-2">
                <button onClick={() => setActiveTab('drops')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'drops' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
                    <LayoutGrid size={20} /> <span className="font-medium">DROPS</span>
                </button>
                <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
                    <ShoppingBag size={20} /> <span className="font-medium">ORDERS</span>
                </button>
                <button onClick={() => setActiveTab('shipment')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'shipment' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
                    <Truck size={20} /> <span className="font-medium">SHIPMENT</span>
                </button>
                <button onClick={() => setActiveTab('extra')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'extra' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
                    <Tag size={20} /> <span className="font-medium">EXTRA</span>
                </button>
            </nav>
        </div>
    );

    const renderDrops = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">INVENTORY</h2>
                <Button onClick={() => setShowAddModal(true)}>
                    <Plus size={20} className="mr-2" /> NEW DROP
                </Button>
            </div>

            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <table className="w-full">
                    <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800">
                        <tr>
                            <th className="text-left p-4 text-xs font-medium text-neutral-500">PRODUCT</th>
                            <th className="text-left p-4 text-xs font-medium text-neutral-500">CATEGORY</th>
                            <th className="text-left p-4 text-xs font-medium text-neutral-500">PRICE</th>
                            <th className="text-left p-4 text-xs font-medium text-neutral-500">STOCK</th>
                            <th className="text-right p-4 text-xs font-medium text-neutral-500">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                        {products.map(product => (
                            <tr key={product._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded overflow-hidden">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="font-medium">{product.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-neutral-500">{product.category}</td>
                                <td className="p-4 font-medium">{product.price} DZD</td>
                                <td className="p-4">
                                    <button onClick={() => handleToggleStock(product)} className={`px-2 py-1 rounded text-xs font-medium ${product.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                        {product.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                                    </button>
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleDeleteProduct(product._id)} className="text-neutral-400 hover:text-red-500 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderOrders = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">ORDERS</h2>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <table className="w-full">
                    <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800">
                        <tr>
                            <th className="text-left p-4 text-xs font-medium text-neutral-500">ORDER ID</th>
                            <th className="text-left p-4 text-xs font-medium text-neutral-500">CUSTOMER</th>
                            <th className="text-left p-4 text-xs font-medium text-neutral-500">ITEMS</th>
                            <th className="text-left p-4 text-xs font-medium text-neutral-500">TOTAL</th>
                            <th className="text-left p-4 text-xs font-medium text-neutral-500">STATUS</th>
                            <th className="text-right p-4 text-xs font-medium text-neutral-500">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                        {orders.map(order => (
                            <tr key={order._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                <td className="p-4 font-mono text-xs text-neutral-500">#{order._id.slice(-6)}</td>
                                <td className="p-4">
                                    <div className="font-medium">{order.fullName}</div>
                                    <div className="text-xs text-neutral-500">{order.wilaya}</div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="text-neutral-600 dark:text-neutral-400">
                                                {item.quantity}x {item.name} ({item.size})
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-4 font-medium">{order.totalAmount} DZD</td>
                                <td className="p-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        className="bg-transparent border border-neutral-200 dark:border-neutral-700 rounded px-2 py-1 text-xs"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button onClick={() => startEditOrder(order)} className="text-neutral-400 hover:text-blue-500 transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDeleteOrder(order._id)} className="text-neutral-400 hover:text-red-500 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderShipment = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">SHIPMENT</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <table className="w-full">
                        <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800">
                            <tr>
                                <th className="text-left p-4 text-xs font-medium text-neutral-500">CODE</th>
                                <th className="text-left p-4 text-xs font-medium text-neutral-500">WILAYA</th>
                                <th className="text-left p-4 text-xs font-medium text-neutral-500">FEE</th>
                                <th className="text-left p-4 text-xs font-medium text-neutral-500">COMMUNES</th>
                                <th className="text-right p-4 text-xs font-medium text-neutral-500">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {wilayas.map(wilaya => (
                                <tr key={wilaya._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                    <td className="p-4 font-mono text-xs">{wilaya.code}</td>
                                    <td className="p-4 font-medium">{wilaya.name}</td>
                                    <td className="p-4">{wilaya.deliveryFee} DZD</td>
                                    <td className="p-4 text-xs text-neutral-500 max-w-xs truncate">
                                        {wilaya.communes?.join(', ') || '-'}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleDeleteWilaya(wilaya._id)} className="text-neutral-400 hover:text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 h-fit">
                    <h3 className="font-bold mb-4">ADD WILAYA</h3>
                    <form onSubmit={handleAddWilaya} className="space-y-4">
                        <input type="number" placeholder="Code" required className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-3" value={newWilaya.code} onChange={e => setNewWilaya({ ...newWilaya, code: e.target.value })} />
                        <input type="text" placeholder="Wilaya Name" required className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-3" value={newWilaya.name} onChange={e => setNewWilaya({ ...newWilaya, name: e.target.value })} />
                        <input type="number" placeholder="Delivery Fee" required className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-3" value={newWilaya.deliveryFee} onChange={e => setNewWilaya({ ...newWilaya, deliveryFee: e.target.value })} />
                        <textarea placeholder="Communes (comma separated)" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-3" rows="3" value={newWilaya.communes} onChange={e => setNewWilaya({ ...newWilaya, communes: e.target.value })} />
                        <Button type="submit" className="w-full">ADD WILAYA</Button>
                    </form>
                </div>
            </div>
        </div>
    );

    const renderExtra = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">EXTRA (COUPONS)</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <table className="w-full">
                        <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800">
                            <tr>
                                <th className="text-left p-4 text-xs font-medium text-neutral-500">CODE</th>
                                <th className="text-left p-4 text-xs font-medium text-neutral-500">DISCOUNT</th>
                                <th className="text-right p-4 text-xs font-medium text-neutral-500">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {coupons.map(coupon => (
                                <tr key={coupon._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                    <td className="p-4 font-mono font-medium">{coupon.code}</td>
                                    <td className="p-4">{coupon.discountPercentage}%</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleDeleteCoupon(coupon._id)} className="text-neutral-400 hover:text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 h-fit">
                    <h3 className="font-bold mb-4">ADD COUPON</h3>
                    <form onSubmit={handleAddCoupon} className="space-y-4">
                        <input type="text" placeholder="Coupon Code" required className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-3" value={newCoupon.code} onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })} />
                        <input type="number" placeholder="Discount %" required className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-3" value={newCoupon.discountPercentage} onChange={e => setNewCoupon({ ...newCoupon, discountPercentage: e.target.value })} />
                        <Button type="submit" className="w-full">CREATE COUPON</Button>
                    </form>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white">
            {renderSidebar()}

            <main className="ml-64 p-8">
                {activeTab === 'drops' && renderDrops()}
                {activeTab === 'orders' && renderOrders()}
                {activeTab === 'shipment' && renderShipment()}
                {activeTab === 'extra' && renderExtra()}
            </main>

            {/* Add Drop Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 w-full max-w-md p-6 relative shadow-lg">
                        <h2 className="text-xl font-bold mb-6">ADD NEW DROP</h2>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <input type="text" placeholder="Name" required className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-3" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                            <div className="grid grid-cols-2 gap-4">
                                <select className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-3" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                                    <option value="Streetwear">Streetwear</option>
                                    <option value="Hoodies">Hoodies</option>
                                    <option value="Anime">Anime</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                                <input type="number" placeholder="Price" required className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-3" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                            </div>
                            <input type="number" placeholder="Discount Price (Optional)" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-3" value={newProduct.discountPrice} onChange={e => setNewProduct({ ...newProduct, discountPrice: e.target.value })} />
                            <textarea placeholder="Image URLs (one per line)" required rows="4" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-3" value={newProduct.images || newProduct.image} onChange={e => {
                                const val = e.target.value;
                                setNewProduct({ ...newProduct, image: val, images: val }); // Store raw string for now
                            }} />
                            <input type="text" placeholder="Sizes (S,M,L,XL)" required className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-3" value={newProduct.sizes} onChange={e => setNewProduct({ ...newProduct, sizes: e.target.value })} />
                            <textarea placeholder="Description" required rows="3" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-3" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />

                            <div className="flex gap-4 mt-6">
                                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)}>CANCEL</Button>
                                <Button type="submit" className="flex-1">CREATE DROP</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Order Modal */}
            {editingOrder && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 w-full max-w-2xl p-6 relative shadow-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">EDIT ORDER #{editingOrder._id.slice(-6)}</h2>
                            <button onClick={() => setEditingOrder(null)}><X size={24} /></button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 mb-2">ORDER STATUS</label>
                                <select
                                    value={editOrderData.status}
                                    onChange={(e) => setEditOrderData({ ...editOrderData, status: e.target.value })}
                                    className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-3"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-500 mb-2">CUSTOMER DETAILS</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Full Name" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-3" value={editOrderData.fullName} onChange={e => setEditOrderData({ ...editOrderData, fullName: e.target.value })} />
                                    <input type="text" placeholder="Phone" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-3" value={editOrderData.phone} onChange={e => setEditOrderData({ ...editOrderData, phone: e.target.value })} />
                                    <input type="text" placeholder="Wilaya" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-3" value={editOrderData.wilaya} onChange={e => setEditOrderData({ ...editOrderData, wilaya: e.target.value })} />
                                    <input type="text" placeholder="Commune" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-3" value={editOrderData.commune} onChange={e => setEditOrderData({ ...editOrderData, commune: e.target.value })} />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                                <Button variant="secondary" className="flex-1" onClick={() => setEditingOrder(null)}>CANCEL</Button>
                                <Button className="flex-1" onClick={saveOrderEdit}><Save size={18} className="mr-2" /> SAVE CHANGES</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            <ConfirmModal
                show={confirmModal.show}
                message={confirmModal.message}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal({ show: false, message: '', onConfirm: null })}
            />
        </div>
    );
};

export default AdminDashboard;
