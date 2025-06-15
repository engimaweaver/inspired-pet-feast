
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: 'basic' | 'professional' | 'enterprise';
  status: 'active' | 'suspended' | 'trial';
  createdAt: string;
  settings: TenantSettings;
  stores: Store[];
  users: TenantUser[];
  subscription?: Subscription;
}

export interface TenantSettings {
  branding: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    theme: 'light' | 'dark' | 'auto';
  };
  features: {
    multiStore: boolean;
    advancedAnalytics: boolean;
    loyaltyProgram: boolean;
    aiRecommendations: boolean;
    customReports: boolean;
  };
  integrations: {
    paymentGateways: string[];
    deliveryServices: string[];
    accountingSoftware?: string;
  };
  compliance: {
    region: string;
    taxSettings: Record<string, any>;
    dataRetention: number; // days
  };
}

export interface Store {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  timezone: string;
  currency: string;
  settings: StoreSettings;
}

export interface StoreSettings {
  openingHours: Record<string, { open: string; close: string; closed: boolean }>;
  seatingCapacity: number;
  tableCount: number;
  deliveryRadius?: number;
  minimumOrder?: number;
}

export interface TenantUser {
  id: string;
  tenantId: string;
  email: string;
  role: 'owner' | 'manager' | 'staff';
  stores: string[]; // store IDs user has access to
  permissions: string[];
  status: 'active' | 'inactive' | 'pending';
}

export interface Subscription {
  id: string;
  tenantId: string;
  plan: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  addOns: string[];
  billing: {
    amount: number;
    currency: string;
    interval: 'monthly' | 'yearly';
  };
}

class MultiTenantService {
  private currentTenant: Tenant | null = null;
  private tenants: Map<string, Tenant> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Mock franchise data
    const mockTenant: Tenant = {
      id: 'tenant-1',
      name: 'Premium Restaurant Group',
      slug: 'premium-restaurants',
      plan: 'enterprise',
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      settings: {
        branding: {
          primaryColor: '#3b82f6',
          secondaryColor: '#10b981',
          theme: 'light'
        },
        features: {
          multiStore: true,
          advancedAnalytics: true,
          loyaltyProgram: true,
          aiRecommendations: true,
          customReports: true
        },
        integrations: {
          paymentGateways: ['stripe', 'razorpay'],
          deliveryServices: ['uber-eats', 'zomato'],
          accountingSoftware: 'quickbooks'
        },
        compliance: {
          region: 'IN',
          taxSettings: { gst: 18 },
          dataRetention: 2555 // 7 years
        }
      },
      stores: [
        {
          id: 'store-1',
          tenantId: 'tenant-1',
          name: 'Downtown Premium',
          address: '123 Main St, Mumbai',
          phone: '+91-9876543210',
          email: 'downtown@premium.com',
          status: 'active',
          timezone: 'Asia/Kolkata',
          currency: 'INR',
          settings: {
            openingHours: {
              monday: { open: '09:00', close: '22:00', closed: false },
              tuesday: { open: '09:00', close: '22:00', closed: false },
              wednesday: { open: '09:00', close: '22:00', closed: false },
              thursday: { open: '09:00', close: '22:00', closed: false },
              friday: { open: '09:00', close: '23:00', closed: false },
              saturday: { open: '09:00', close: '23:00', closed: false },
              sunday: { open: '10:00', close: '21:00', closed: false },
            },
            seatingCapacity: 80,
            tableCount: 20,
            deliveryRadius: 10,
            minimumOrder: 300
          }
        },
        {
          id: 'store-2',
          tenantId: 'tenant-1',
          name: 'Mall Premium',
          address: '456 Mall Road, Mumbai',
          phone: '+91-9876543211',
          email: 'mall@premium.com',
          status: 'active',
          timezone: 'Asia/Kolkata',
          currency: 'INR',
          settings: {
            openingHours: {
              monday: { open: '10:00', close: '22:00', closed: false },
              tuesday: { open: '10:00', close: '22:00', closed: false },
              wednesday: { open: '10:00', close: '22:00', closed: false },
              thursday: { open: '10:00', close: '22:00', closed: false },
              friday: { open: '10:00', close: '23:00', closed: false },
              saturday: { open: '10:00', close: '23:00', closed: false },
              sunday: { open: '10:00', close: '22:00', closed: false },
            },
            seatingCapacity: 60,
            tableCount: 15,
            deliveryRadius: 8,
            minimumOrder: 250
          }
        }
      ],
      users: [
        {
          id: 'user-1',
          tenantId: 'tenant-1',
          email: 'owner@premium.com',
          role: 'owner',
          stores: ['store-1', 'store-2'],
          permissions: ['*'],
          status: 'active'
        },
        {
          id: 'user-2',
          tenantId: 'tenant-1',
          email: 'manager@premium.com',
          role: 'manager',
          stores: ['store-1'],
          permissions: ['billing', 'analytics', 'inventory'],
          status: 'active'
        }
      ],
      subscription: {
        id: 'sub-1',
        tenantId: 'tenant-1',
        plan: 'enterprise',
        status: 'active',
        currentPeriodStart: '2024-01-01T00:00:00Z',
        currentPeriodEnd: '2024-12-31T23:59:59Z',
        addOns: ['ai-recommendations', 'advanced-reporting'],
        billing: {
          amount: 29900,
          currency: 'INR',
          interval: 'monthly'
        }
      }
    };

    this.tenants.set(mockTenant.id, mockTenant);
    this.currentTenant = mockTenant;
  }

  getCurrentTenant(): Tenant | null {
    return this.currentTenant;
  }

  async setCurrentTenant(tenantId: string): Promise<void> {
    const tenant = this.tenants.get(tenantId);
    if (tenant) {
      this.currentTenant = tenant;
      this.applyTenantSettings(tenant);
    }
  }

  private applyTenantSettings(tenant: Tenant): void {
    // Apply branding
    document.documentElement.style.setProperty('--primary-color', tenant.settings.branding.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', tenant.settings.branding.secondaryColor);
    
    // Apply theme
    if (tenant.settings.branding.theme !== 'auto') {
      document.documentElement.classList.toggle('dark', tenant.settings.branding.theme === 'dark');
    }
  }

  getTenantStores(tenantId?: string): Store[] {
    const tenant = tenantId ? this.tenants.get(tenantId) : this.currentTenant;
    return tenant?.stores || [];
  }

  getTenantUsers(tenantId?: string): TenantUser[] {
    const tenant = tenantId ? this.tenants.get(tenantId) : this.currentTenant;
    return tenant?.users || [];
  }

  isFeatureEnabled(feature: keyof TenantSettings['features']): boolean {
    return this.currentTenant?.settings.features[feature] || false;
  }

  getTenantSettings(): TenantSettings | null {
    return this.currentTenant?.settings || null;
  }

  async updateTenantSettings(settings: Partial<TenantSettings>): Promise<void> {
    if (this.currentTenant) {
      this.currentTenant.settings = { ...this.currentTenant.settings, ...settings };
      this.applyTenantSettings(this.currentTenant);
    }
  }

  async createStore(storeData: Omit<Store, 'id' | 'tenantId'>): Promise<Store> {
    if (!this.currentTenant) {
      throw new Error('No current tenant');
    }

    const store: Store = {
      ...storeData,
      id: `store-${Date.now()}`,
      tenantId: this.currentTenant.id
    };

    this.currentTenant.stores.push(store);
    return store;
  }

  async updateStore(storeId: string, updates: Partial<Store>): Promise<void> {
    if (!this.currentTenant) {
      throw new Error('No current tenant');
    }

    const storeIndex = this.currentTenant.stores.findIndex(s => s.id === storeId);
    if (storeIndex >= 0) {
      this.currentTenant.stores[storeIndex] = { 
        ...this.currentTenant.stores[storeIndex], 
        ...updates 
      };
    }
  }

  async inviteUser(userData: Omit<TenantUser, 'id' | 'tenantId' | 'status'>): Promise<TenantUser> {
    if (!this.currentTenant) {
      throw new Error('No current tenant');
    }

    const user: TenantUser = {
      ...userData,
      id: `user-${Date.now()}`,
      tenantId: this.currentTenant.id,
      status: 'pending'
    };

    this.currentTenant.users.push(user);
    return user;
  }

  getSubscriptionInfo(): Subscription | null {
    return this.currentTenant?.subscription || null;
  }

  async upgradePlan(planId: string, addOns: string[] = []): Promise<void> {
    if (this.currentTenant?.subscription) {
      this.currentTenant.subscription.plan = planId;
      this.currentTenant.subscription.addOns = addOns;
    }
  }
}

export default new MultiTenantService();
