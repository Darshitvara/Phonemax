export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  specifications: {
    display: string;
    processor: string;
    memory: string;
    storage: string;
    camera: string;
    battery: string;
    os: string;
  };
  category: 'mobiles' | 'airbuds' | 'powerbanks' | 'laptops' | 'smartwatches';
  subcategory: string;
  stock: number;
  rating: number;
  reviews: Review[];
  featured: boolean;
  createdAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  selectedColor?: string;
  selectedStorage?: string;
  // For guest/localStorage fallback we may have the full product
  product?: Product;
  id?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}