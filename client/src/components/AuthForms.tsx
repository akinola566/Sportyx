import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { insertUserSchema, loginSchema } from "@shared/schema";

interface AuthFormsProps {
  activeTab: 'login' | 'register';
}

const AuthForms = ({ activeTab }: AuthFormsProps) => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: "",
      password: ""
    }
  });

  // Register form
  const registerForm = useForm<z.infer<typeof insertUserSchema>>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      phoneNumber: ""
    }
  });

  const onLogin = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/login", data);
      
      // Successfully logged in
      toast({
        title: "Success",
        description: "You have been logged in successfully!",
      });
      
      // Clear any previous queries
      queryClient.invalidateQueries();
      
      // Force a direct navigation to the dashboard page
      window.location.href = "/dashboard";
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email/username or password",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const onRegister = async (data: z.infer<typeof insertUserSchema>) => {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/register", data);
      toast({
        title: "Registration Successful",
        description: "Your account has been created! You can now log in.",
      });
      setLocation("/auth/login");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Username or email may already be in use",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={activeTab === 'login' ? '' : 'hidden'}>
        <h2 className="text-2xl font-montserrat font-bold mb-6">Login to Your Account</h2>
        <form className="space-y-4" onSubmit={loginForm.handleSubmit(onLogin)}>
          <div>
            <Label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-700 mb-1">
              Email or Username
            </Label>
            <Input
              id="emailOrUsername"
              {...loginForm.register("emailOrUsername")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {loginForm.formState.errors.emailOrUsername && (
              <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.emailOrUsername.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              {...loginForm.register("password")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {loginForm.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox id="remember-me" />
              <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                Remember me
              </Label>
            </div>
            <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
          </div>
          <div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-red-700 text-white font-montserrat font-semibold py-2 px-4 rounded transition"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
      </div>

      <div className={activeTab === 'register' ? '' : 'hidden'}>
        <h2 className="text-2xl font-montserrat font-bold mb-6">Create Your Account</h2>
        <form className="space-y-4" onSubmit={registerForm.handleSubmit(onRegister)}>
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...registerForm.register("email")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {registerForm.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </Label>
            <Input
              id="username"
              {...registerForm.register("username")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {registerForm.formState.errors.username && (
              <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.username.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              {...registerForm.register("phoneNumber")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {registerForm.formState.errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.phoneNumber.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              {...registerForm.register("password")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {registerForm.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.password.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              {...registerForm.register("confirmPassword")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {registerForm.formState.errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>
          <div className="flex items-center">
            <Checkbox id="agree-terms" required />
            <Label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-600">
              I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </Label>
          </div>
          <div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-red-700 text-white font-montserrat font-semibold py-2 px-4 rounded transition"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AuthForms;
