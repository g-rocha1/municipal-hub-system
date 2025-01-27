import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import UserList from "./pages/users/UserList";
import UserAdd from "./pages/users/UserAdd";
import UserEdit from "./pages/users/UserEdit";
import ChangePassword from "./pages/users/ChangePassword";
import FinancialTransactions from "./pages/financial/FinancialTransactions";
import TransactionForm from "./pages/financial/TransactionForm";
import FinancialGoals from "./pages/financial/FinancialGoals";
import FinancialDashboard from "./pages/financial/FinancialDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Sidebar />
                    <Header />
                    <main className="pl-16 pt-14">
                      <div className="container py-6">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/users" element={<UserList />} />
                          <Route path="/users/add" element={<UserAdd />} />
                          <Route path="/users/edit/:id" element={<UserEdit />} />
                          <Route path="/users/change-password" element={<ChangePassword />} />
                          <Route path="/financial/transactions" element={<FinancialTransactions />} />
                          <Route path="/financial/transactions/add" element={<TransactionForm />} />
                          <Route path="/financial/goals" element={<FinancialGoals />} />
                          <Route path="/financial/dashboard" element={<FinancialDashboard />} />
                        </Routes>
                      </div>
                    </main>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;