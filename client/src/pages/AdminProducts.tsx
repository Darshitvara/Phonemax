import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Package, Search, Filter } from 'lucide-react';
import { api } from '../utils/api';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import ProductEditModal from '../components/Admin/ProductEditModal';
import ProductCreateModal from '../components/Admin/ProductCreateModal';
import { Product } from '../types';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const { addNotification } = useNotifications();
  const { user, makeAdmin } = useAuth();

  const categories = ['all', 'mobiles', 'laptops', 'airbuds', 'smartwatches', 'powerbanks'];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.products || response);
      
      // Success notification on first load (only if products exist)
      if ((response.products || response).length > 0) {
        addNotification({
          type: 'success',
          title: 'Products Loaded',
          message: `Successfully loaded ${(response.products || response).length} products.`,
          duration: 2000
        });
      }
    } catch (error) {
      console.error('Error loading products:', error);
      
      // Error notification
      addNotification({
        type: 'error',
        title: 'Loading Failed',
        message: 'Failed to load products from database. Please refresh the page.',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    console.log('Attempting to delete product with ID:', productId);
    
    // Get product for dialog
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await api.delete(`/products/${productToDelete.id}`);
      setProducts(products.filter(p => p.id !== productToDelete.id));
      
      // Success notification
      addNotification({
        type: 'success',
        title: 'Product Deleted',
        message: `"${productToDelete.name}" has been successfully deleted from your store.`,
        duration: 4000
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      
      // Error notification
      addNotification({
        type: 'error',
        title: 'Delete Failed',
        message: `Failed to delete "${productToDelete.name}". Please try again.`,
        duration: 5000
      });
    } finally {
      setProductToDelete(null);
    }
  };

  const handleEditProduct = async (updatedProduct: Partial<Product>) => {
    if (!editingProduct) return;

    try {
      const response = await api.put(`/products/${editingProduct.id}`, updatedProduct);
      console.log('Update response:', response); // Debug log
      
      // The api client returns data directly, not wrapped in .data
      const updatedProductData = response.product || updatedProduct;
      
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...p, ...updatedProductData } : p
      ));
      
      // Success notification
      addNotification({
        type: 'success',
        title: 'Product Updated',
        message: `"${updatedProduct.name || editingProduct.name}" has been successfully updated.`,
        duration: 4000
      });

      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      
      // Error notification
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: `Failed to update "${editingProduct.name}". Please try again.`,
        duration: 5000
      });
    }
  };

  const handleCreateProduct = async (productData: any) => {
    try {
      const response = await api.post('/products', productData);
      console.log('Create response:', response); // Debug log
      
      // The api client returns data directly, not wrapped in .data
      const newProduct = response.product || response;
      
      // Add the new product to the list
      setProducts(prevProducts => [...prevProducts, newProduct]);
      
      // Success notification
      addNotification({
        type: 'success',
        title: 'Product Created',
        message: `"${productData.name}" has been successfully added to your store.`,
        duration: 4000
      });

      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating product:', error);
      
      // Error notification
      addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: `Failed to create "${productData.name}". Please try again.`,
        duration: 5000
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-2">{products.length} total products</p>
            {user && (
              <p className="text-sm text-gray-500 mt-1">
                Logged in as: {user.email} ({user.role})
                {user.role !== 'admin' && (
                  <button
                    onClick={async () => {
                      const success = await makeAdmin();
                      if (success) {
                        addNotification({
                          type: 'success',
                          title: 'Admin Access Granted',
                          message: 'You now have admin privileges.',
                          duration: 3000
                        });
                      }
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    Get Admin Access
                  </button>
                )}
              </p>
            )}
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={product.images[0]}
                          alt={product.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.brand}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price}
                      {product.originalPrice && (
                        <span className="text-gray-500 line-through ml-2">
                          ${product.originalPrice}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 font-medium">
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.stock > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Get started by adding your first product.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDeleteProduct}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Product Edit Modal */}
      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleEditProduct}
        />
      )}

      {/* Product Create Modal */}
      {showCreateForm && (
        <ProductCreateModal
          onClose={() => setShowCreateForm(false)}
          onSave={handleCreateProduct}
        />
      )}
    </div>
  );
};

export default AdminProducts;
