const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id?: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status?: string;
  createdAt?: string;
}

export interface CreateOrder extends Omit<Order, '_id' | 'totalAmount' | 'status' | 'createdAt' | 'items'> {
  items: Omit<OrderItem, 'productName' | 'price'>[];
}

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export const ordersService = {
  async create(order: CreateOrder): Promise<Order> {
    const response = await fetch(`${API_URL}/api/v1/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    return response.json();
  },

  async getAll(): Promise<Order[]> {
    const response = await fetch(`${API_URL}/api/v1/orders`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return response.json();
  },
};
