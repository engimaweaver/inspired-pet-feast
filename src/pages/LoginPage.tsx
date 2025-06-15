
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ActionButtonGroup } from '@/components/ui/action-button-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Eye, EyeOff, LogIn, UserCheck, Shield, Crown } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useUser();
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
      
      // Mock user data based on email
      const mockUser = {
        id: 'user-1',
        name: 'Demo User',
        email: email,
        role: 'admin' as const,
        store: 'Main Store'
      };

      login(mockUser);
      
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

  const handleQuickLogin = (role: 'admin' | 'manager' | 'cashier') => {
    const userData = {
      admin: {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@restaurant.com',
        role: 'admin' as const,
        store: 'All Stores'
      },
      manager: {
        id: 'manager-1',
        name: 'Manager User',
        email: 'manager@restaurant.com',
        role: 'manager' as const,
        store: 'Main Store'
      },
      cashier: {
        id: 'cashier-1',
        name: 'Cashier User',
        email: 'cashier@restaurant.com',
        role: 'cashier' as const,
        store: 'Main Store'
      }
    };

    login(userData[role]);
    
    toast({
      title: "Quick Login Successful",
      description: `Logged in as ${role}`
    });
    
    navigate('/');
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
      <div className="space-y-6">
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
        </div>

        {/* Quick Login Options */}
        <div className="border-t pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Demo Login</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full flex items-center justify-start gap-3 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              onClick={() => handleQuickLogin('cashier')}
            >
              <UserCheck className="h-4 w-4" />
              Login as Cashier
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-start gap-3 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              onClick={() => handleQuickLogin('manager')}
            >
              <Shield className="h-4 w-4" />
              Login as Manager
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-start gap-3 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
              onClick={() => handleQuickLogin('admin')}
            >
              <Crown className="h-4 w-4" />
              Login as Admin
            </Button>
          </div>
        </div>
        
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
