import {
  ref,
  push,
  set,
  get,
  update,
  remove,
  query,
  orderByChild,
  orderByKey,
  orderByValue,
  limitToFirst,
  limitToLast,
  startAt,
  endAt,
  equalTo,
  onValue,
  off,
  serverTimestamp,
  child,
} from "firebase/database";
import { database } from "./config";
import { BUSINESS_CONSTANTS } from "../../utils/constants/orderStatus";

// Database service class
class DatabaseService {
  constructor() {
    this.listeners = new Map();
  }

  // Generic CRUD operations

  // Create a new record
  async create(path, data) {
    try {
      const newRef = push(ref(database, path));
      const dataWithTimestamp = {
        ...data,
        id: newRef.key,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await set(newRef, dataWithTimestamp);
      return { success: true, id: newRef.key, data: dataWithTimestamp };
    } catch (error) {
      console.error(`Error creating record at ${path}:`, error);
      throw error;
    }
  }

  // Read a single record
  async read(path) {
    try {
      const snapshot = await get(ref(database, path));
      if (snapshot.exists()) {
        return { success: true, data: snapshot.val() };
      }
      return { success: false, data: null };
    } catch (error) {
      console.error(`Error reading record at ${path}:`, error);
      throw error;
    }
  }

  // Update a record
  async update(path, updates) {
    try {
      const dataWithTimestamp = {
        ...updates,
        updatedAt: serverTimestamp(),
      };
      await update(ref(database, path), dataWithTimestamp);
      return { success: true, data: dataWithTimestamp };
    } catch (error) {
      console.error(`Error updating record at ${path}:`, error);
      throw error;
    }
  }

  // Delete a record
  async delete(path) {
    try {
      await remove(ref(database, path));
      return { success: true };
    } catch (error) {
      console.error(`Error deleting record at ${path}:`, error);
      throw error;
    }
  }

  // Query records with filters
  async query(path, filters = {}) {
    try {
      let dbQuery = ref(database, path);

      // Apply ordering
      if (filters.orderBy) {
        switch (filters.orderBy.type) {
          case "child":
            dbQuery = query(dbQuery, orderByChild(filters.orderBy.key));
            break;
          case "key":
            dbQuery = query(dbQuery, orderByKey());
            break;
          case "value":
            dbQuery = query(dbQuery, orderByValue());
            break;
        }
      }

      // Apply equality filter
      if (filters.equalTo) {
        dbQuery = query(dbQuery, equalTo(filters.equalTo));
      }

      // Apply range filters
      if (filters.startAt) {
        dbQuery = query(dbQuery, startAt(filters.startAt));
      }
      if (filters.endAt) {
        dbQuery = query(dbQuery, endAt(filters.endAt));
      }

      // Apply limits
      if (filters.limitToFirst) {
        dbQuery = query(dbQuery, limitToFirst(filters.limitToFirst));
      }
      if (filters.limitToLast) {
        dbQuery = query(dbQuery, limitToLast(filters.limitToLast));
      }

      const snapshot = await get(dbQuery);
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Convert object to array if needed
        const results = Array.isArray(data) ? data : Object.values(data);
        return { success: true, data: results };
      }
      return { success: true, data: [] };
    } catch (error) {
      console.error(`Error querying records at ${path}:`, error);
      throw error;
    }
  }

  // Real-time listeners
  addListener(path, callback, filters = {}) {
    try {
      let dbQuery = ref(database, path);

      // Apply filters similar to query method
      if (filters.orderBy) {
        switch (filters.orderBy.type) {
          case "child":
            dbQuery = query(dbQuery, orderByChild(filters.orderBy.key));
            break;
          case "key":
            dbQuery = query(dbQuery, orderByKey());
            break;
          case "value":
            dbQuery = query(dbQuery, orderByValue());
            break;
        }
      }

      if (filters.equalTo) {
        dbQuery = query(dbQuery, equalTo(filters.equalTo));
      }
      if (filters.startAt) {
        dbQuery = query(dbQuery, startAt(filters.startAt));
      }
      if (filters.endAt) {
        dbQuery = query(dbQuery, endAt(filters.endAt));
      }
      if (filters.limitToFirst) {
        dbQuery = query(dbQuery, limitToFirst(filters.limitToFirst));
      }
      if (filters.limitToLast) {
        dbQuery = query(dbQuery, limitToLast(filters.limitToLast));
      }

      const unsubscribe = onValue(
        dbQuery,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const results = Array.isArray(data) ? data : Object.values(data);
            callback(results);
          } else {
            callback([]);
          }
        },
        (error) => {
          console.error(`Error in listener for ${path}:`, error);
          callback(null, error);
        }
      );

      // Store listener for cleanup
      this.listeners.set(path, unsubscribe);

      return unsubscribe;
    } catch (error) {
      console.error(`Error adding listener for ${path}:`, error);
      throw error;
    }
  }

  // Remove listener
  removeListener(path) {
    const unsubscribe = this.listeners.get(path);
    if (unsubscribe) {
      unsubscribe();
      this.listeners.delete(path);
    }
  }

  // Product-specific methods

  async getProducts(filters = {}) {
    const queryFilters = {
      orderBy: { type: "child", key: "createdAt" },
      limitToFirst:
        filters.limit || BUSINESS_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
      ...filters,
    };
    return this.query("products", queryFilters);
  }

  async getProductById(productId) {
    return this.read(`products/${productId}`);
  }

  async getProductsByCategory(
    categoryId,
    limit = BUSINESS_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE
  ) {
    return this.query("products", {
      orderBy: { type: "child", key: "category" },
      equalTo: categoryId,
      limitToFirst: limit,
    });
  }

  async createProduct(productData) {
    try {
      // Step 1: Create the product using existing create method
      const result = await this.create("products", productData);

      if (result.success) {
        // Step 2: Create corresponding inventory entry
        const inventoryData = {
          productId: result.id,
          stock: parseInt(productData.inventory) || 0,
          sku: productData.sku || "",
          lowStockThreshold: 10,
          reorderPoint: 5,
        };

        // Create inventory entry (without triggering another timestamp)
        await this.create("inventory", {
          ...inventoryData,
          id: result.id, // Use same ID as product
        });

        console.log("Product and inventory created successfully");
      }

      return result;
    } catch (error) {
      console.error("Error in createProduct:", error);
      throw error;
    }
  }

  async updateProduct(productId, updates) {
    try {
      // Step 1: Update the product using existing update method
      const result = await this.update(`products/${productId}`, updates);

      if (result.success && updates.inventory !== undefined) {
        // Step 2: Update corresponding inventory entry if inventory changed
        await this.update(`inventory/${productId}`, {
          stock: parseInt(updates.inventory) || 0,
        });

        console.log("Product and inventory updated successfully");
      }

      return result;
    } catch (error) {
      console.error("Error in updateProduct:", error);
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      // Step 1: Delete the product
      const result = await this.delete(`products/${productId}`);

      if (result.success) {
        // Step 2: Delete corresponding inventory entry
        await this.delete(`inventory/${productId}`);
        console.log("Product and inventory deleted successfully");
      }

      return result;
    } catch (error) {
      console.error("Error in deleteProduct:", error);
      throw error;
    }
  }

  // Utility method to sync existing products with inventory
  async syncProductInventory(productId) {
    try {
      // Get product data
      const productResult = await this.read(`products/${productId}`);

      if (!productResult.success || !productResult.data) {
        return { success: false, error: "Product not found" };
      }

      const product = productResult.data;

      // Create inventory entry using create method
      const inventoryData = {
        productId: productId,
        stock: parseInt(product.inventory) || 0,
        sku: product.sku || "",
        lowStockThreshold: 10,
        reorderPoint: 5,
      };

      const result = await this.create("inventory", {
        ...inventoryData,
        id: productId,
      });

      return result;
    } catch (error) {
      console.error("Error syncing inventory:", error);
      return { success: false, error: error.message };
    }
  }

  // Sync all existing products with inventory
  async syncAllProductsInventory() {
    try {
      const productsResult = await this.query("products", {
        orderBy: { type: "key" },
      });

      if (!productsResult.success || !productsResult.data) {
        return {
          success: true,
          message: "No products to sync",
          synced: 0,
          failed: 0,
          total: 0,
        };
      }

      const products = Array.isArray(productsResult.data)
        ? productsResult.data
        : Object.values(productsResult.data);

      let synced = 0;
      let failed = 0;

      for (const product of products) {
        try {
          if (product.id) {
            await this.syncProductInventory(product.id);
            synced++;
            console.log(`Synced inventory for product: ${product.id}`);
          }
        } catch (error) {
          console.error(`Failed to sync inventory for ${product.id}:`, error);
          failed++;
        }
      }

      return {
        success: true,
        synced,
        failed,
        total: products.length,
        message: `Synced ${synced} out of ${products.length} products`,
      };
    } catch (error) {
      console.error("Error syncing all inventories:", error);
      return { success: false, error: error.message };
    }
  }

  // Category methods

  async getCategories() {
    return this.query("categories", {
      orderBy: { type: "child", key: "name" },
    });
  }

  async getCategoryById(categoryId) {
    return this.read(`categories/${categoryId}`);
  }

  async createCategory(categoryData) {
    return this.create("categories", categoryData);
  }

  async updateCategory(categoryId, updates) {
    return this.update(`categories/${categoryId}`, updates);
  }

  // Order methods

  async createOrder(orderData) {
    return this.create("orders", orderData);
  }

  async getOrderById(orderId) {
    return this.read(`orders/${orderId}`);
  }

  async getUserOrders(userId, limit = 10) {
    return this.query("orders", {
      orderBy: { type: "child", key: "userId" },
      equalTo: userId,
      limitToFirst: limit,
    });
  }

  async updateOrderStatus(orderId, status) {
    return this.update(`orders/${orderId}`, { status });
  }

  async getAllOrders(filters = {}) {
    const queryFilters = {
      orderBy: { type: "child", key: "createdAt" },
      limitToFirst:
        filters.limit || BUSINESS_CONSTANTS.PAGINATION.ADMIN_PAGE_SIZE,
      ...filters,
    };
    return this.query("orders", queryFilters);
  }

  // Cart methods

  async getCart(userId) {
    return this.read(`carts/${userId}`);
  }

  async updateCart(userId, cartData) {
    return this.update(`carts/${userId}`, cartData);
  }

  async addToCart(userId, productId, quantity = 1) {
    const cartItemData = {
      quantity,
      addedAt: serverTimestamp(),
    };
    return this.update(`carts/${userId}/${productId}`, cartItemData);
  }

  async removeFromCart(userId, productId) {
    return this.delete(`carts/${userId}/${productId}`);
  }

  async clearCart(userId) {
    return this.delete(`carts/${userId}`);
  }

  // Wishlist methods

  async getWishlist(userId) {
    return this.read(`wishlists/${userId}`);
  }

  async addToWishlist(userId, productId) {
    const wishlistItemData = {
      addedAt: serverTimestamp(),
    };
    return this.update(`wishlists/${userId}/${productId}`, wishlistItemData);
  }

  async removeFromWishlist(userId, productId) {
    return this.delete(`wishlists/${userId}/${productId}`);
  }

  // Review methods

  async createReview(reviewData) {
    return this.create("reviews", reviewData);
  }

  async getProductReviews(productId, limit = 10) {
    return this.query("reviews", {
      orderBy: { type: "child", key: "productId" },
      equalTo: productId,
      limitToFirst: limit,
    });
  }

  async getUserReviews(userId, limit = 10) {
    return this.query("reviews", {
      orderBy: { type: "child", key: "userId" },
      equalTo: userId,
      limitToFirst: limit,
    });
  }

  async updateReview(reviewId, updates) {
    return this.update(`reviews/${reviewId}`, updates);
  }

  async deleteReview(reviewId) {
    return this.delete(`reviews/${reviewId}`);
  }

  // Inventory methods

  async getInventory() {
    return this.query("inventory", {
      orderBy: { type: "key" },
    });
  }

  async getInventoryItem(productId) {
    return this.read(`inventory/${productId}`);
  }

  async updateInventory(productId, inventoryData) {
    return this.update(`inventory/${productId}`, inventoryData);
  }

  async decrementInventory(productId, quantity) {
    try {
      const inventoryItem = await this.getInventoryItem(productId);
      if (inventoryItem.success && inventoryItem.data) {
        const currentStock = inventoryItem.data.stock || 0;
        const newStock = Math.max(0, currentStock - quantity);

        return this.updateInventory(productId, {
          stock: newStock,
          lastUpdated: serverTimestamp(),
        });
      }
      throw new Error("Inventory item not found");
    } catch (error) {
      console.error("Error decrementing inventory:", error);
      throw error;
    }
  }

  async incrementInventory(productId, quantity) {
    try {
      const inventoryItem = await this.getInventoryItem(productId);
      if (inventoryItem.success && inventoryItem.data) {
        const currentStock = inventoryItem.data.stock || 0;
        const newStock = currentStock + quantity;

        return this.updateInventory(productId, {
          stock: newStock,
          lastUpdated: serverTimestamp(),
        });
      }
      throw new Error("Inventory item not found");
    } catch (error) {
      console.error("Error incrementing inventory:", error);
      throw error;
    }
  }

  // Address methods

  async getUserAddresses(userId) {
    return this.read(`users/${userId}/addresses`);
  }

  async addUserAddress(userId, addressData) {
    const addressRef = push(ref(database, `users/${userId}/addresses`));
    const addressWithId = {
      ...addressData,
      id: addressRef.key,
      createdAt: serverTimestamp(),
    };
    await set(addressRef, addressWithId);
    return { success: true, id: addressRef.key, data: addressWithId };
  }

  async updateUserAddress(userId, addressId, updates) {
    return this.update(`users/${userId}/addresses/${addressId}`, updates);
  }

  async deleteUserAddress(userId, addressId) {
    return this.delete(`users/${userId}/addresses/${addressId}`);
  }

  // Search methods

  async searchProducts(searchTerm, filters = {}) {
    try {
      // Get all products (in a real app, you'd use a search service like Algolia)
      const productsResult = await this.query("products");

      if (productsResult.success) {
        const allProducts = productsResult.data || [];

        // Filter products based on search term
        const filteredProducts = allProducts.filter((product) => {
          const searchLower = searchTerm.toLowerCase();
          const nameMatch =
            product.name && product.name.toLowerCase().includes(searchLower);
          const descriptionMatch =
            product.description &&
            product.description.toLowerCase().includes(searchLower);
          const categoryMatch =
            product.category &&
            product.category.toLowerCase().includes(searchLower);
          const tagsMatch =
            product.tags &&
            product.tags.some((tag) => tag.toLowerCase().includes(searchLower));

          return nameMatch || descriptionMatch || categoryMatch || tagsMatch;
        });

        // Apply additional filters
        let results = filteredProducts;

        if (filters.category) {
          results = results.filter(
            (product) => product.category === filters.category
          );
        }

        if (filters.minPrice) {
          results = results.filter(
            (product) => product.price >= filters.minPrice
          );
        }

        if (filters.maxPrice) {
          results = results.filter(
            (product) => product.price <= filters.maxPrice
          );
        }

        if (filters.inStock) {
          results = results.filter((product) => product.inventory > 0);
        }

        // Sort results
        if (filters.sortBy) {
          results.sort((a, b) => {
            switch (filters.sortBy) {
              case "price_low":
                return a.price - b.price;
              case "price_high":
                return b.price - a.price;
              case "name":
                return a.name.localeCompare(b.name);
              case "newest":
                return new Date(b.createdAt) - new Date(a.createdAt);
              default:
                return 0;
            }
          });
        }

        // Apply pagination
        const page = filters.page || 1;
        const limit =
          filters.limit || BUSINESS_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedResults = results.slice(startIndex, endIndex);

        return {
          success: true,
          data: paginatedResults,
          total: results.length,
          page,
          totalPages: Math.ceil(results.length / limit),
        };
      }

      return { success: true, data: [], total: 0 };
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  }

  // Analytics methods (for admin)

  async getOrderStats(startDate, endDate) {
    try {
      const orders = await this.query("orders", {
        orderBy: { type: "child", key: "createdAt" },
        startAt: startDate,
        endAt: endDate,
      });

      if (orders.success) {
        const orderData = orders.data || [];
        const stats = {
          totalOrders: orderData.length,
          totalRevenue: orderData.reduce(
            (sum, order) => sum + (order.totalAmount || 0),
            0
          ),
          averageOrderValue: 0,
          statusBreakdown: {},
        };

        if (stats.totalOrders > 0) {
          stats.averageOrderValue = stats.totalRevenue / stats.totalOrders;
        }

        // Calculate status breakdown
        orderData.forEach((order) => {
          const status = order.status || "unknown";
          stats.statusBreakdown[status] =
            (stats.statusBreakdown[status] || 0) + 1;
        });

        return { success: true, data: stats };
      }

      return { success: true, data: null };
    } catch (error) {
      console.error("Error getting order stats:", error);
      throw error;
    }
  }

  // Utility methods

  async batchUpdate(updates) {
    try {
      const promises = Object.entries(updates).map(([path, data]) =>
        this.update(path, data)
      );
      await Promise.all(promises);
      return { success: true };
    } catch (error) {
      console.error("Error in batch update:", error);
      throw error;
    }
  }

  // Cleanup all listeners
  cleanup() {
    this.listeners.forEach((unsubscribe) => {
      unsubscribe();
    });
    this.listeners.clear();
  }
}

// Create and export singleton instance
const databaseService = new DatabaseService();
export default databaseService;
