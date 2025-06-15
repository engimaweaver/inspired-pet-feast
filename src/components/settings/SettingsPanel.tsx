
import React, { useState } from 'react';
import { StandardizedCard } from '@/components/ui/standardized-card';
import { StandardizedDialog } from '@/components/ui/standardized-dialog';
import { ActionButtonGroup } from '@/components/ui/action-button-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Settings, User, LogOut, Save } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const { user, updateUser, logout } = useUser();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      updateUser(formData);
      toast({
        title: "Settings Updated",
        description: "Your profile has been updated successfully"
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully"
    });
    onClose();
  };

  const buttons = [
    {
      label: 'Save Changes',
      onClick: handleSave,
      icon: <Save className="h-4 w-4" />,
      loading: loading,
      disabled: !formData.name || !formData.email
    },
    {
      label: 'Logout',
      onClick: handleLogout,
      variant: 'destructive' as const,
      icon: <LogOut className="h-4 w-4" />
    }
  ];

  return (
    <StandardizedDialog
      isOpen={isOpen}
      onClose={onClose}
      title="User Settings"
      description="Manage your profile and account settings"
      size="md"
      footer={<ActionButtonGroup buttons={buttons} />}
    >
      <div className="space-y-4">
        <StandardizedCard title="Profile Information" size="sm">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Role</Label>
              <div className="text-sm text-gray-600 capitalize">
                {user?.role} {user?.store && `- ${user.store}`}
              </div>
            </div>
          </div>
        </StandardizedCard>
      </div>
    </StandardizedDialog>
  );
};
