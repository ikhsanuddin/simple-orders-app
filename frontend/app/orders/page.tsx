'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ordersService } from '@/services/orders.service';
import { authService } from '@/services/auth.service';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    loadOrders();
  }, [router]);

  const loadOrders = async () => {
    try {
      const data = await ordersService.getAll();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  const user = authService.getUser();

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <>
      <div className="header">
        <div className="container">
          <h1>Order History</h1>
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

        {orders.length === 0 ? (
          <div className="empty-state">
            <h2>No orders yet</h2>
            <p style={{ marginBottom: 10}}>Start by browsing products and creating your first order!</p>
            <Link href="/products">
              <button className="btn btn-primary">Browse Products</button>
            </Link>
          </div>
        ) : (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.slice(-8)}</td>
                    <td>{order.customerName}</td>
                    <td>{order.customerEmail}</td>
                    <td>{order.items.length}</td>
                    <td>Rp {order.totalAmount.toLocaleString('id-ID')}</td>
                    <td>
                      <span className={`badge badge-${order.status}`}>{order.status}</span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
