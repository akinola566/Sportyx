import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IdActivation from "@/components/IdActivation";
import PredictionsDashboard from "@/components/PredictionsDashboard";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const DashboardPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState<string>("");

  // Define types for user data and activation status
  interface UserData {
    id: number;
    username: string;
    email: string;
    phoneNumber: string;
    isIdActivated: boolean;
  }

  interface ActivationStatus {
    isActivated: boolean;
  }

  // Fetch user data
  const { data: userData, isLoading: isLoadingUser } = useQuery<UserData>({
    queryKey: ["/api/auth/me"],
    retry: 2,
    retryDelay: 1000,
    onSuccess: (data) => {
      setUsername(data.username);
    },
    onError: () => {
      toast({
        title: "Authentication Error",
        description: "Please login again",
        variant: "destructive",
      });
      setLocation("/auth/login");
    },
  });

  // Check if user's ID is activated
  const { data: activationStatus, isLoading: isLoadingActivation } = useQuery<ActivationStatus>({
    queryKey: ["/api/user/activation-status"],
    retry: 2,
    retryDelay: 1000,
    enabled: !!userData, // Only run this query if user data is available
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to check activation status",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (userData) {
      setUsername(userData.username);
    }
  }, [userData]);

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", undefined);
      queryClient.clear();
      setLocation("/");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const isIdActivated = activationStatus?.isActivated || false;
  const isLoading = isLoadingUser || isLoadingActivation;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header 
        isAuthenticated={true}
        username={username} 
        onLogout={handleLogout}
      />

      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {!isIdActivated && <IdActivation />}
          <PredictionsDashboard isVisible={isIdActivated} />
        </>
      )}

      <Footer />
    </div>
  );
};

export default DashboardPage;
