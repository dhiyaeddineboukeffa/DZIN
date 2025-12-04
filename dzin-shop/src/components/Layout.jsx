import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartSidebar from './CartSidebar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-neutral-950 text-white selection:bg-emerald-500 selection:text-black">
            <Navbar />
            <CartSidebar />
            <main className="flex-1 pt-16">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
