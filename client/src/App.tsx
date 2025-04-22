import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/DashboardPage";
import NotFound from "@/pages/not-found";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useEffect, useState } from "react";
import { apiRequest } from "./lib/queryClient";

function Router() {
  const [location, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiRequest("GET", "/api/auth/check", undefined);
        if (res.ok) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        // User is not authenticated
      }
    };
    
    checkAuth();
  }, []);

  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth">
        {() => <AuthPage isLogin={location === "/auth/login"} />}
      </Route>
      <Route path="/auth/login">
        {() => <AuthPage isLogin={true} />}
      </Route>
      <Route path="/auth/register">
        {() => <AuthPage isLogin={false} />}
      </Route>
      <Route path="/dashboard">
        {() => isAuthenticated ? <DashboardPage /> : (setLocation("/auth/login"), null)}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <WhatsAppButton />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
