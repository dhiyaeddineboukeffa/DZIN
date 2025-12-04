import React, { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Hoodies', 'Streetwear', 'Anime'];

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await api.getProducts();
                setProducts(data);
                setFilteredProducts(data);
            } catch (error) {
                console.error('Failed to load products', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadProducts();
    }, []);

    useEffect(() => {
        if (activeCategory === 'All') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === activeCategory));
        }
    }, [activeCategory, products]);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 text-neutral-900 dark:text-white">SHOP ALL DROPS</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 font-mono">SECURE YOUR GEAR BEFORE IT'S GONE</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 text-sm font-bold border transition-all duration-200 ${activeCategory === cat
                                ? 'bg-emerald-500 text-black border-emerald-500'
                                : 'bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 hover:text-emerald-500 dark:hover:text-white'
                                }`}
                        >
                            {cat.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <div key={n} className="aspect-[4/5] bg-neutral-900 animate-pulse" />
                    ))}
                </div>
            ) : (
                <>
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-20">
                            <h3 className="text-2xl font-bold text-neutral-500 dark:text-neutral-400">NO DROPS FOUND IN THIS CATEGORY.</h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Shop;
