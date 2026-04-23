import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreProvider, useStore } from "@/context/StoreContext";
import Navbar from "@/components/Navbar";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import CustomerDashboard from "@/pages/customer/CustomerDashboard";
import ShopDetailPage from "@/pages/customer/ShopDetailPage";
import MyOrdersPage from "@/pages/customer/MyOrdersPage";
import AssigningDelivery from "@/pages/customer/AssigningDelivery";
import ShopkeeperDashboard from "@/pages/shopkeeper/ShopkeeperDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import DeliveryDashboard from "@/pages/delivery/DeliveryDashboard";
import InventoryPage from "@/pages/InventoryPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import CartPage from "@/pages/CartPage";
import ExpensesPage from "@/pages/ExpensesPage";
import CreditManager from "@/features/CreditManager";
import PurchaseHistory from "@/features/PurchaseHistory";
import OffersPanel from "@/features/OffersPanel";
import WeeklyReport from "@/features/WeeklyReport";
import SmartInsights from "@/features/SmartInsights";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isLoggedIn, role } = useStore();

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* Customer routes */}
        {role === 'customer' && (
          <>
            <Route path="/" element={<CustomerDashboard />} />
            <Route path="/shop/:id" element={<ShopDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path="/assigning-delivery" element={<AssigningDelivery />} />
            <Route path="/history" element={<PurchaseHistory />} />
            <Route path="/offers" element={<OffersPanel />} />
            <Route path="/expenses" element={<ExpensesPage />} />
          </>
        )}

        {/* Shopkeeper routes */}
        {role === 'shopkeeper' && (
          <>
            <Route path="/" element={<ShopkeeperDashboard />} />
            <Route path="/credit" element={<CreditManager />} />
            <Route path="/report" element={<WeeklyReport />} />
            <Route path="/insights" element={<SmartInsights />} />
            <Route path="/expenses" element={<ExpensesPage />} />
          </>
        )}

        {/* Admin routes */}
        {role === 'admin' && (
          <>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/credit" element={<CreditManager />} />
            <Route path="/report" element={<WeeklyReport />} />
            <Route path="/insights" element={<SmartInsights />} />
            <Route path="/expenses" element={<ExpensesPage />} />
          </>
        )}

        {/* Delivery Partner routes */}
        {role === 'delivery' && (
          <>
            <Route path="/" element={<DeliveryDashboard />} />
            <Route path="/earnings" element={<DeliveryDashboard />} />
          </>
        )}

        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © 2026 SmartGroc — All rights reserved.
      </footer>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <StoreProvider>
          <AppRoutes />
        </StoreProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
