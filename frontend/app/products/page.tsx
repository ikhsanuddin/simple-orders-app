'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { productsService, Product } from '@/services/products.service';
import { authService } from '@/services/auth.service';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: number }>({});
  const router = useRouter();

  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    loadProducts();
  }, [router]);

  const loadProducts = async () => {
    try {
      const data = await productsService.getAll();
      // Sort products: in-stock first, out-of-stock last
      const sortedProducts = data.sort((a, b) => {
        if (a.stock === 0 && b.stock > 0) return 1;
        if (a.stock > 0 && b.stock === 0) return -1;
        return 0;
      });
      setProducts(sortedProducts);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    const product = products.find((p) => p._id === productId);
    
    if (quantity <= 0) {
      const newSelected = { ...selectedProducts };
      delete newSelected[productId];
      setSelectedProducts(newSelected);
    } else if (product && quantity > product.stock) {
      // Prevent quantity from exceeding stock
      setSelectedProducts({ ...selectedProducts, [productId]: product.stock });
      alert(`Maximum available quantity for ${product.name} is ${product.stock}`);
    } else {
      setSelectedProducts({ ...selectedProducts, [productId]: quantity });
    }
  };

  const handleProceedToOrder = () => {
    const selectedItems = Object.entries(selectedProducts).map(([productId, quantity]) => {
      const product = products.find((p) => p._id === productId);
      return { productId, quantity, product };
    });

    if (selectedItems.length === 0) {
      alert('Please select at least one product');
      return;
    }

    localStorage.setItem('selectedProducts', JSON.stringify(selectedItems));
    router.push('/orders/new');
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  const user = authService.getUser();

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <>
      <div className="header">
        <div className="container">
          <h1>Product Catalog</h1>
          <div className="nav">
            <Link href="/products">Products</Link>
            <Link href="/orders">Order History</Link>
            <div className="user-info">
              <span>Welcome, {user?.name}</span>
              <button onClick={handleLogout} className="btn btn-logout">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {error && <div className="error">{error}</div>}

        {Object.keys(selectedProducts).length > 0 && (
          <div className="card">
            <h2>Selected Products: {Object.keys(selectedProducts).length}</h2>
            <button onClick={handleProceedToOrder} className="btn btn-success">
              Proceed to Order
            </button>
          </div>
        )}

        <div className="product-grid">
          {products.map((product) => (
            <div 
              key={product._id} 
              className={`product-card ${product.stock === 0 ? 'out-of-stock' : ''}`}
            >
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="product-price">Rp {product.price.toLocaleString('id-ID')}</div>
              <p className={product.stock === 0 ? 'stock-label-empty' : 'stock-label'}>
                Stock: {product.stock} units {product.stock === 0 && '(Out of Stock)'}
              </p>
              <div className="form-group">
                <label htmlFor={`qty-${product._id}`}>Quantity</label>
                <input
                  id={`qty-${product._id}`}
                  type="number"
                  min="0"
                  max={product.stock}
                  value={selectedProducts[product._id] || 0}
                  onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value) || 0)}
                  disabled={product.stock === 0}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
