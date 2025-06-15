
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ActionButtonGroup } from '@/components/ui/action-button-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate login - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Login Successful",
        description: "Welcome back to RestaurantOS"
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const buttons = [
    {
      label: loading ? 'Signing In...' : 'Sign In',
      onClick: handleLogin,
      icon: <LogIn className="h-4 w-4" />,
      loading: loading,
      disabled: !email || !password
    }
  ];

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to your RestaurantOS account"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        <ActionButtonGroup buttons={buttons} orientation="vertical" />
        
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
