
import React, { useState } from 'react';
import { StandardizedCard } from '@/components/ui/standardized-card';
import { ActionButtonGroup } from '@/components/ui/action-button-group';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Bell, Check, Trash2, Settings, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const NotificationCenterPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Low Stock Alert',
      message: 'Basmati Rice is running low (5kg remaining)',
      type: 'warning',
      time: '2 minutes ago',
      read: false
    },
    {
      id: '2',
      title: 'New Order Received',
      message: 'Order #156 received from Table 5',
      type: 'info',
      time: '5 minutes ago',
      read: false
    },
    {
      id: '3',
      title: 'Payment Successful',
      message: 'Payment of ₹450 received for Order #155',
      type: 'success',
      time: '10 minutes ago',
      read: true
    },
    {
      id: '4',
      title: 'Kitchen Alert',
      message: 'Order #154 ready for pickup',
      type: 'info',
      time: '15 minutes ago',
      read: true
    }
  ]);

  const [settings, setSettings] = useState({
    orderNotifications: true,
    inventoryAlerts: true,
    paymentUpdates: true,
    systemUpdates: false,
    emailNotifications: true,
    soundAlerts: true
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'warning':
        return 'destructive' as const;
      case 'success':
        return 'default' as const;
      case 'info':
      default:
        return 'secondary' as const;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const actionButtons = [
    {
      label: 'Mark All Read',
      onClick: markAllAsRead,
      icon: <Check className="h-4 w-4" />,
      disabled: unreadCount === 0
    },
    {
      label: 'Clear All',
      onClick: clearAll,
      variant: 'outline' as const,
      icon: <Trash2 className="h-4 w-4" />,
      disabled: notifications.length === 0
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Notification Center</h1>
            <p className="text-gray-600">
              Manage your notifications and alerts
              {unreadCount > 0 && (
                <Badge className="ml-2">{unreadCount} unread</Badge>
              )}
            </p>
          </div>
        </div>
        <ActionButtonGroup buttons={actionButtons} />
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList>
          <TabsTrigger value="notifications">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {notifications.length === 0 ? (
            <StandardizedCard size="lg" className="text-center">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up! No new notifications.</p>
            </StandardizedCard>
          ) : (
            <StandardizedCard title="Recent Notifications" size="lg">
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`mt-1 ${notification.read ? 'opacity-50' : ''}`}>
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                              {notification.title}
                            </h3>
                            <Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                              {notification.type}
                            </Badge>
                            {!notification.read && (
                              <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 hover:bg-blue-100 rounded"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4 text-blue-600" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 hover:bg-red-100 rounded"
                          title="Delete notification"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </StandardizedCard>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <StandardizedCard title="Notification Preferences" size="lg">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Application Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order Notifications</p>
                      <p className="text-sm text-gray-600">Get notified about new orders and updates</p>
                    </div>
                    <Switch
                      checked={settings.orderNotifications}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, orderNotifications: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Inventory Alerts</p>
                      <p className="text-sm text-gray-600">Low stock and inventory warnings</p>
                    </div>
                    <Switch
                      checked={settings.inventoryAlerts}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, inventoryAlerts: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment Updates</p>
                      <p className="text-sm text-gray-600">Payment confirmations and failures</p>
                    </div>
                    <Switch
                      checked={settings.paymentUpdates}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, paymentUpdates: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System Updates</p>
                      <p className="text-sm text-gray-600">Software updates and maintenance</p>
                    </div>
                    <Switch
                      checked={settings.systemUpdates}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, systemUpdates: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Delivery Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sound Alerts</p>
                      <p className="text-sm text-gray-600">Play sound for important notifications</p>
                    </div>
                    <Switch
                      checked={settings.soundAlerts}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, soundAlerts: checked }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </StandardizedCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationCenterPage;
