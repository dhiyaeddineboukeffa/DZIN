import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [videoSetting, setVideoSetting] = useState(null);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const s = await api.getSetting('manifesto_video');
                if (s.value) {
                    const match = s.value.match(/(?:reel|p)\/([a-zA-Z0-9_-]+)/);
                    if (match) setVideoSetting(match[1]);
                }
            } catch (e) {
                console.error('Failed video setting', e);
            }
        };
        loadSettings();

        const loadProducts = async () => {
            try {
                const products = await api.getProducts();
                // Show latest 4 products (assuming new ones are at the end, so reverse)
                setFeaturedProducts([...products].reverse().slice(0, 4));
            } catch (error) {
                console.error('Failed to load products', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadProducts();
    }, []);

    return (
        <div className="space-y-12 sm:space-y-20 pb-12 sm:pb-20">
            {/* Hero Section */}
            <section className="relative h-[60vh] sm:h-[70vh] lg:h-[90vh] flex items-center">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/hero_bg_v2.jpg"
                        alt="Algiers Streetwear"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-neutral-950/50 to-transparent dark:from-neutral-950 dark:via-neutral-950/50" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-block border border-emerald-500/50 bg-black/50 backdrop-blur-sm px-4 py-1 mb-4 sm:mb-6">
                            <span className="text-emerald-500 font-mono text-xs sm:text-sm tracking-widest">EST. 2025 // ALGIERS</span>
                        </div>
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-4 sm:mb-6 glitch-border text-neutral-900 dark:text-white">
                            BORN IN <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500">DZ</span>
                        </h1>
                        <p className="text-base sm:text-xl text-neutral-600 dark:text-neutral-300 mb-6 sm:mb-8 max-w-xl leading-relaxed">
                            Where tradition meets cyber-culture. The first Algerian streetwear brand fusing local heritage with neo-tokyo aesthetics.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <Link to="/shop" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full min-h-[48px]">
                                    SHOP LATEST DROP <ArrowRight className="ml-2" size={20} />
                                </Button>
                            </Link>
                            <Link to="/collections" className="w-full sm:w-auto">
                                <Button variant="secondary" size="lg" className="w-full min-h-[48px]">
                                    VIEW COLLECTIONS
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Drops */}
            <section className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter mb-2 text-neutral-900 dark:text-white">LATEST DROPS</h2>
                        <p className="text-neutral-500 dark:text-neutral-400 font-mono">LIMITED QUANTITIES AVAILABLE</p>
                    </div>
                    <Link to="/shop" className="hidden md:block text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-bold">
                        VIEW ALL PRODUCTS &gt;
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="aspect-[4/5] bg-neutral-900 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

                <div className="mt-12 text-center md:hidden">
                    <Link to="/shop">
                        <Button variant="outline" className="w-full">VIEW ALL PRODUCTS</Button>
                    </Link>
                </div>
            </section>

            {/* Brand Manifesto */}
            <section className="container mx-auto px-4 py-20 border-y border-neutral-200 dark:border-neutral-900">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter mb-6 text-neutral-900 dark:text-white">
                            THE <span className="text-emerald-500">FUTURE</span> IS NOW
                        </h2>
                        <div className="space-y-6 text-neutral-600 dark:text-neutral-400 text-lg">
                            <p>
                                DZIN represents the new wave of Algerian creativity. We don't just make clothes; we tell stories of a future where the Casbah's winding streets meet the neon lights of a cyberpunk metropolis.
                            </p>
                            <p>
                                Every piece is limited edition. Once it's gone, it's gone forever.
                            </p>
                        </div>
                    </div>
                    <div className={`relative ${videoSetting ? 'aspect-[9/16] max-w-sm mx-auto' : 'aspect-video'} bg-neutral-200 dark:bg-neutral-900 overflow-hidden group w-full`}>
                        {videoSetting ? (
                            <iframe
                                src={`https://www.instagram.com/reel/${videoSetting}/embed`}
                                className="w-full h-full object-cover"
                                frameBorder="0"
                                allowFullScreen
                            />
                        ) : (
                            <>
                                <img
                                    src="https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=1000"
                                    alt="Manifesto"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-20 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm">
                                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
