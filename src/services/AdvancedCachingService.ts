
export interface CacheItem {
  key: string;
  value: any;
  timestamp: number;
  ttl: number; // time to live in milliseconds
  tags: string[];
  hits: number;
  size: number; // estimated size in bytes
}

export interface CacheStats {
  totalItems: number;
  totalSize: number;
  hitRate: number;
  missRate: number;
  evictions: number;
  oldestItem: number;
  newestItem: number;
}

export interface CacheConfig {
  maxSize: number; // maximum cache size in bytes
  maxItems: number; // maximum number of items
  defaultTTL: number; // default TTL in milliseconds
  cleanupInterval: number; // cleanup interval in milliseconds
  enablePersistence: boolean;
  strategy: 'LRU' | 'LFU' | 'FIFO';
}

class AdvancedCachingService {
  private cache: Map<string, CacheItem> = new Map();
  private accessOrder: string[] = []; // for LRU
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    operations: 0
  };
  
  private config: CacheConfig = {
    maxSize: 50 * 1024 * 1024, // 50MB
    maxItems: 10000,
    defaultTTL: 30 * 60 * 1000, // 30 minutes
    cleanupInterval: 5 * 60 * 1000, // 5 minutes
    enablePersistence: true,
    strategy: 'LRU'
  };

  private cleanupTimer?: NodeJS.Timeout;

  constructor(config?: Partial<CacheConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    
    this.startCleanupTimer();
    this.loadFromPersistence();
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  private estimateSize(value: any): number {
    try {
      return JSON.stringify(value).length * 2; // rough estimate
    } catch {
      return 1000; // fallback size
    }
  }

  private updateAccessOrder(key: string): void {
    if (this.config.strategy === 'LRU') {
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
      }
      this.accessOrder.push(key);
    }
  }

  private evictItems(): void {
    const totalSize = Array.from(this.cache.values()).reduce((sum, item) => sum + item.size, 0);
    const itemCount = this.cache.size;

    // Check if we need to evict based on size or count
    if (totalSize > this.config.maxSize || itemCount > this.config.maxItems) {
      const itemsToEvict = Math.max(1, Math.floor(itemCount * 0.1)); // evict 10%
      
      let evicted = 0;
      while (evicted < itemsToEvict && this.cache.size > 0) {
        let keyToEvict: string;
        
        switch (this.config.strategy) {
          case 'LRU':
            keyToEvict = this.accessOrder[0];
            this.accessOrder.shift();
            break;
          case 'LFU':
            keyToEvict = Array.from(this.cache.entries())
              .sort(([, a], [, b]) => a.hits - b.hits)[0][0];
            break;
          case 'FIFO':
          default:
            keyToEvict = Array.from(this.cache.keys())[0];
            break;
        }
        
        this.cache.delete(keyToEvict);
        this.stats.evictions++;
        evicted++;
      }
    }
  }

  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    // Find expired items
    this.cache.forEach((item, key) => {
      if (now > item.timestamp + item.ttl) {
        expiredKeys.push(key);
      }
    });

    // Remove expired items
    expiredKeys.forEach(key => {
      this.cache.delete(key);
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
      }
    });

    // Evict items if cache is too large
    this.evictItems();

    // Persist cache if enabled
    if (this.config.enablePersistence) {
      this.persistCache();
    }
  }

  private persistCache(): void {
    try {
      const cacheData = {
        cache: Array.from(this.cache.entries()),
        accessOrder: this.accessOrder,
        stats: this.stats,
        timestamp: Date.now()
      };
      localStorage.setItem('advanced_cache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to persist cache:', error);
    }
  }

  private loadFromPersistence(): void {
    if (!this.config.enablePersistence) return;

    try {
      const stored = localStorage.getItem('advanced_cache');
      if (stored) {
        const data = JSON.parse(stored);
        
        // Only load if data is recent (within 1 hour)
        if (Date.now() - data.timestamp < 60 * 60 * 1000) {
          this.cache = new Map(data.cache);
          this.accessOrder = data.accessOrder || [];
          this.stats = { ...this.stats, ...data.stats };
        }
      }
    } catch (error) {
      console.warn('Failed to load persisted cache:', error);
    }
  }

  public set(key: string, value: any, ttl?: number, tags: string[] = []): void {
    const item: CacheItem = {
      key,
      value,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
      tags,
      hits: 0,
      size: this.estimateSize(value)
    };

    this.cache.set(key, item);
    this.updateAccessOrder(key);
    this.stats.operations++;
    
    // Check if we need to evict
    this.evictItems();
  }

  public get(key: string): any {
    const item = this.cache.get(key);
    this.stats.operations++;

    if (!item) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() > item.timestamp + item.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update access statistics
    item.hits++;
    this.updateAccessOrder(key);
    this.stats.hits++;
    
    return item.value;
  }

  public has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    // Check if expired
    if (Date.now() > item.timestamp + item.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  public delete(key: string): boolean {
    const result = this.cache.delete(key);
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    return result;
  }

  public clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    this.stats = { hits: 0, misses: 0, evictions: 0, operations: 0 };
  }

  public invalidateByTag(tag: string): number {
    let invalidated = 0;
    const keysToDelete: string[] = [];

    this.cache.forEach((item, key) => {
      if (item.tags.includes(tag)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      this.delete(key);
      invalidated++;
    });

    return invalidated;
  }

  public getStats(): CacheStats {
    const items = Array.from(this.cache.values());
    const totalOperations = this.stats.hits + this.stats.misses;
    
    return {
      totalItems: this.cache.size,
      totalSize: items.reduce((sum, item) => sum + item.size, 0),
      hitRate: totalOperations > 0 ? (this.stats.hits / totalOperations) * 100 : 0,
      missRate: totalOperations > 0 ? (this.stats.misses / totalOperations) * 100 : 0,
      evictions: this.stats.evictions,
      oldestItem: items.length > 0 ? Math.min(...items.map(i => i.timestamp)) : 0,
      newestItem: items.length > 0 ? Math.max(...items.map(i => i.timestamp)) : 0
    };
  }

  public getItemsByTag(tag: string): CacheItem[] {
    return Array.from(this.cache.values()).filter(item => item.tags.includes(tag));
  }

  public updateConfig(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Restart cleanup timer if interval changed
    if (config.cleanupInterval && this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.startCleanupTimer();
    }
  }

  public exportCache(): string {
    return JSON.stringify({
      cache: Array.from(this.cache.entries()),
      accessOrder: this.accessOrder,
      stats: this.stats,
      config: this.config
    }, null, 2);
  }

  public destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clear();
  }

  // High-level caching methods for common use cases
  public cacheApiResponse(url: string, data: any, ttl?: number): void {
    this.set(`api:${url}`, data, ttl, ['api', 'response']);
  }

  public getCachedApiResponse(url: string): any {
    return this.get(`api:${url}`);
  }

  public cacheMenuData(storeId: string, menuData: any): void {
    this.set(`menu:${storeId}`, menuData, 15 * 60 * 1000, ['menu', `store:${storeId}`]); // 15 minutes
  }

  public getCachedMenuData(storeId: string): any {
    return this.get(`menu:${storeId}`);
  }

  public cacheAnalyticsData(key: string, data: any): void {
    this.set(`analytics:${key}`, data, 5 * 60 * 1000, ['analytics']); // 5 minutes
  }

  public getCachedAnalyticsData(key: string): any {
    return this.get(`analytics:${key}`);
  }

  public invalidateStoreData(storeId: string): number {
    return this.invalidateByTag(`store:${storeId}`);
  }
}

export default new AdvancedCachingService();
