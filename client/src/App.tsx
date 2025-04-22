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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check authentication status on mount and on location change
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Use type parameter to specify the expected response format
        const authData = await apiRequest<{ isAuthenticated: boolean }>("GET", "/api/auth/check", undefined);
        setIsAuthenticated(authData?.isAuthenticated || false);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [location]);

  // If on dashboard and not authenticated, redirect to login
  useEffect(() => {
    if (isAuthenticated === false && location === "/dashboard") {
      setLocation("/auth/login");
    }
  }, [isAuthenticated, location, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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
        {() => <DashboardPage />}
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
