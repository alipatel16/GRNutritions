import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

// Context Providers
import { AppProvider } from './context/AppContext/AppProvider';

// Layouts
import MainLayout from './layouts/MainLayout/MainLayout';
import AdminLayout from './layouts/AdminLayout/AdminLayout';
import AuthLayout from './layouts/AuthLayout/AuthLayout';

// Components
import LoadingSpinner from './components/common/LoadingSpinner/LoadingSpinner';
import ErrorFallback from './components/common/ErrorBoundary/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';

// Constants
import { ROUTES } from './utils/constants/routes';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home/Home'));
const Products = lazy(() => import('./pages/Products/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const Checkout = lazy(() => import('./pages/Checkout/Checkout'));
const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Orders = lazy(() => import('./pages/Orders/Orders'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/Admin/AdminLogin'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess/PaymentSuccess'));
const PaymentFailure = lazy(() => import('./pages/PaymentFailure/PaymentFailure'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

// Admin Pages
const AdminProducts = lazy(() => import('./pages/Admin/Products/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/Admin/Orders/AdminOrders'));
const AdminInventory = lazy(() => import('./pages/Admin/Inventory/AdminInventory'));
const AdminUsers = lazy(() => import('./pages/Admin/Users/AdminUsers'));
const AdminCategories = lazy(() => import('./pages/Admin/Categories/AdminCategories'));

// const AdminSettings = lazy(() => import('./pages/Admin/Settings/AdminSettings'));

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <AppProvider>
        <Router>
          <div className="App">
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <Routes>
                {/* Public Routes */}
                <Route path={ROUTES.HOME} element={
                  <MainLayout>
                    <Home />
                  </MainLayout>
                } />
                
                <Route path={ROUTES.PRODUCTS} element={
                  <MainLayout>
                    <Products />
                  </MainLayout>
                } />
                
                <Route path={ROUTES.PRODUCT_DETAIL} element={
                  <MainLayout>
                    <ProductDetail />
                  </MainLayout>
                } />
                
                <Route path="/category/:slug" element={
                  <MainLayout>
                    <Products />
                  </MainLayout>
                } />
                
                <Route path="/search" element={
                  <MainLayout>
                    <Products />
                  </MainLayout>
                } />
                
                <Route path={ROUTES.CART} element={
                  <MainLayout>
                    <Cart />
                  </MainLayout>
                } />

                {/* Authentication Routes */}
                <Route path={ROUTES.LOGIN} element={
                  <AuthLayout>
                    <Login />
                  </AuthLayout>
                } />
                
                <Route path={ROUTES.REGISTER} element={
                  <AuthLayout>
                    <Register />
                  </AuthLayout>
                } />

                {/* Protected User Routes */}
                <Route path={ROUTES.CHECKOUT} element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Checkout />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path={ROUTES.PROFILE} element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Profile />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path={ROUTES.ORDERS} element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Orders />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/dashboard/*" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Routes>
                        <Route index element={<Navigate to={ROUTES.PROFILE} replace />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="orders/:id" element={<Orders />} />
                        <Route path="addresses" element={<Profile />} />
                        <Route path="wishlist" element={<Profile />} />
                        <Route path="reviews" element={<Profile />} />
                        <Route path="settings" element={<Profile />} />
                      </Routes>
                    </MainLayout>
                  </ProtectedRoute>
                } />

                {/* Payment Routes */}
                <Route path={ROUTES.PAYMENT_SUCCESS} element={
                  <ProtectedRoute>
                    <MainLayout>
                      <PaymentSuccess />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path={ROUTES.PAYMENT_FAILURE} element={
                  <ProtectedRoute>
                    <MainLayout>
                      <PaymentFailure />
                    </MainLayout>
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path={ROUTES.ADMIN_LOGIN} element={
                  <AuthLayout>
                    <AdminLogin />
                  </AuthLayout>
                } />
                
                <Route path="/admin/*" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminLayout>
                      <Routes>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="products/add" element={<AdminProducts />} />
                        <Route path="products/:id/edit" element={<AdminProducts />} />
                        <Route path="categories" element={<AdminCategories />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="orders/:id" element={<AdminOrders />} />
                        <Route path="inventory" element={<AdminInventory />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="reviews" element={<AdminDashboard />} />
                        <Route path="analytics" element={<AdminDashboard />} />
                        {/* <Route path="settings" element={<AdminSettings />} /> */}
                      </Routes>
                    </AdminLayout>
                  </ProtectedRoute>
                } />

                {/* Static Pages */}
                <Route path="/about" element={
                  <MainLayout>
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      <h1>About Us</h1>
                      <p>Learn more about our nutrition shop and commitment to health.</p>
                    </div>
                  </MainLayout>
                } />
                
                <Route path="/contact" element={
                  <MainLayout>
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      <h1>Contact Us</h1>
                      <p>Get in touch with our support team.</p>
                    </div>
                  </MainLayout>
                } />
                
                <Route path="/faq" element={
                  <MainLayout>
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      <h1>Frequently Asked Questions</h1>
                      <p>Find answers to common questions.</p>
                    </div>
                  </MainLayout>
                } />
                
                <Route path="/terms" element={
                  <MainLayout>
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      <h1>Terms of Service</h1>
                      <p>Read our terms and conditions.</p>
                    </div>
                  </MainLayout>
                } />
                
                <Route path="/privacy" element={
                  <MainLayout>
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      <h1>Privacy Policy</h1>
                      <p>Learn about our privacy practices.</p>
                    </div>
                  </MainLayout>
                } />

                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;