'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ordersService } from '@/services/orders.service';
import { authService } from '@/services/auth.service';

export default function NewOrderPage() {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    const user = authService.getUser();
    if (user) {
      setCustomerEmail(user.email);
      setCustomerName(user.name);
    }

    const items = localStorage.getItem('selectedProducts');
    if (!items) {
      router.push('/products');
      return;
    }
    setSelectedItems(JSON.parse(items));
  }, [router]);

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const orderData = {
      customerName,
      customerEmail,
      items: selectedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      await ordersService.create(orderData);
      setSuccess(true);
      localStorage.removeItem('selectedProducts');
      setTimeout(() => {
        router.push('/orders');
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create order';
      setError(`Failed to create order. Some items may no longer be available. Please check the product catalog and try again.`);
      // Clear local storage to force refresh
      localStorage.removeItem('selectedProducts');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  const user = authService.getUser();

  if (selectedItems.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <div className="header">
        <div className="container">
          <h1>Create New Order</h1>
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
        {success && <div className="success">Order created successfully! Redirecting...</div>}

        <div className="card">
          <h2>Order Summary</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item) => (
                <tr key={item.productId}>
                  <td>{item.product.name}</td>
                  <td>Rp {item.product.price.toLocaleString('id-ID')}</td>
                  <td>{item.quantity}</td>
                  <td>Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  Total:
                </td>
                <td style={{ fontWeight: 'bold' }}>Rp {calculateTotal().toLocaleString('id-ID')}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="card">
          <h2>Customer Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="customerName">Name</label>
              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="customerEmail">Email</label>
              <input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Creating Order...' : 'Place Order'}
              </button>
              <Link href="/products">
                <button type="button" className="btn btn-secondary">
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
