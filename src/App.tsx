import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import UserList from "@/pages/users/UserList";
import UserAdd from "@/pages/users/UserAdd";
import UserEdit from "@/pages/users/UserEdit";
import ChangePassword from "@/pages/users/ChangePassword";
import GoalList from "@/pages/goals/GoalList";
import GoalAdd from "@/pages/goals/GoalAdd";
import GoalEdit from "@/pages/goals/GoalEdit";
import GoalDashboard from "@/pages/goals/GoalDashboard";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-background">
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
                            <Route path="/goals" element={<GoalList />} />
                            <Route path="/goals/dashboard" element={<GoalDashboard />} />
                            <Route path="/goals/add" element={<GoalAdd />} />
                            <Route path="/goals/edit/:id" element={<GoalEdit />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                          </Routes>
                        </div>
                      </main>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;