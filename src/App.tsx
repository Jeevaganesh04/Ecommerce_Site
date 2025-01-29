import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, Menu, Search, X } from "lucide-react";
import Data from "./Data.json";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface UserDetails {
  name: string;
  phone: string;
  address: string;
  email: string;
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: "",
    phone: "",
    address: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<UserDetails>>({});

  const [products] = useState<Product[]>(Data);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    setNotification(`${product.name} added to cart`);
    setTimeout(() => {
      setNotification(null);
    }, 2000);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const handleCheckout = () => {
    setIsCheckoutModalOpen(true);
  };

  const validateForm = () => {
    const errors: Partial<UserDetails> = {};
    if (!userDetails.name.trim()) errors.name = "Name is required";
    if (!userDetails.phone.trim()) errors.phone = "Phone number is required";
    if (!userDetails.address.trim()) errors.address = "Address is required";
    if (!userDetails.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userDetails.email)) {
      errors.email = "Invalid email format";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmCheckout = () => {
    if (!showUserForm) {
      setShowUserForm(true);
      return;
    }

    if (validateForm()) {
      setOrderPlaced(true);
      setCart([]);
      setTimeout(() => {
        setOrderPlaced(false);
        setIsCheckoutModalOpen(false);
        setIsCartOpen(false);
        setShowUserForm(false);
        setUserDetails({
          name: "",
          phone: "",
          address: "",
          email: "",
        });
      }, 2000);
    }
  };

  const closeCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
    setOrderPlaced(false);
    setShowUserForm(false);
    setFormErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name as keyof UserDetails]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-[45%] transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg shadow-lg"
            style={{ zIndex: 9999 }}
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isCheckoutModalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
              {orderPlaced ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <h2 className="text-xl font-semibold text-green-600 mb-2">Success!</h2>
                  <p className="text-gray-700">Your order has been placed</p>
                </motion.div>
              ) : showUserForm ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={userDetails.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          formErrors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                        }`}
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={userDetails.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          formErrors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={userDetails.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          formErrors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shipping Address
                      </label>
                      <textarea
                        name="address"
                        value={userDetails.address}
                        onChange={handleInputChange}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          formErrors.address ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                        }`}
                      />
                      {formErrors.address && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                      )}
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={handleConfirmCheckout}
                        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <b>Place Order</b>
                      </button>
                      <button
                        onClick={closeCheckoutModal}
                        className="mt-2 w-full bg-gray-300 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        <b>Cancel</b>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-4">Checkout</h2>
                  <div>
                    <p className="font-semibold">Total Amount:</p>
                    <p className="text-lg mb-4">${totalPrice.toFixed(2)}</p>
                    <button
                      onClick={handleConfirmCheckout}
                      className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <b>Proceed to Checkout</b>
                    </button>
                    <button
                      onClick={closeCheckoutModal}
                      className="mt-2 w-full bg-gray-300 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      <b>Cancel</b>
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <motion.h1
              className="text-2xl font-bold text-gray-800"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Buytoday
            </motion.h1>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
            <div className="hidden md:flex items-center space-x-8">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="inputBox"
                style={{
                  borderColor: isMenuOpen ? 'blue' : '#ccc',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  padding: '10px',
                  borderRadius: '5px',
                  transition: 'border-color 0.3s ease',
                  outline: 'none',
                  boxShadow: isMenuOpen ? '0 0 5px rgba(0, 0, 255, 0.6)' : 'none',
                }}
                placeholder="Search..."
              />
              <button
                className="text-gray-600 hover:text-gray-800 relative"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <ShoppingCart className="h-6 w-6" />
                {cart.length > 0 && (
                  <motion.span
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {cart.length}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="px-4 py-2 space-y-2">
              <a href="#" className="block py-2">Home</a>
              <a href="#" className="block py-2">Shop</a>
              <a href="#" className="block py-2">About</a>
              <a href="#" className="block py-2">Contact</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shopping Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4 z-50"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Shopping Cart</h2>
              <button onClick={() => setIsCartOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            {cart.length === 0 ? (
              <p className="text-gray-500">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center space-x-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-600">${item.price}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-8 border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {filteredProducts.length === 0 ? (
          <p>No products found for "{searchQuery}"</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="relative pb-[100%]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">${product.price}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default App;