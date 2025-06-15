
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ActionButtonGroup } from '@/components/ui/action-button-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate signup - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Account Created",
        description: "Welcome to RestaurantOS! You can now sign in."
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "An error occurred while creating your account",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const buttons = [
    {
      label: loading ? 'Creating Account...' : 'Create Account',
      onClick: handleSignup,
      icon: <UserPlus className="h-4 w-4" />,
      loading: loading,
      disabled: !formData.name || !formData.email || !formData.password || !formData.confirmPassword
    }
  ];

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join RestaurantOS to manage your restaurant"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
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
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          />
        </div>
        
        <ActionButtonGroup buttons={buttons} orientation="vertical" />
        
        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
