export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

export interface PageLoadMetric {
  url: string;
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  timestamp: number;
}

class PerformanceMonitoringService {
  private metrics: PerformanceMetric[] = [];
  private pageLoads: PageLoadMetric[] = [];
  private observer?: PerformanceObserver;

  constructor() {
    this.initializePerformanceObserver();
    this.setupPageLoadMetrics();
  }

  private initializePerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handlePerformanceEntry(entry);
        }
      });

      try {
        this.observer.observe({ 
          entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'measure'] 
        });
      } catch (error) {
        console.warn('Performance observer setup failed:', error);
      }
    }
  }

  private handlePerformanceEntry(entry: PerformanceEntry): void {
    switch (entry.entryType) {
      case 'navigation':
        this.handleNavigationEntry(entry as PerformanceNavigationTiming);
        break;
      case 'paint':
        this.recordMetric(`paint.${entry.name}`, entry.startTime);
        break;
      case 'largest-contentful-paint':
        this.recordMetric('lcp', entry.startTime);
        break;
      case 'measure':
        this.recordMetric(`custom.${entry.name}`, entry.duration);
        break;
    }
  }

  private handleNavigationEntry(entry: PerformanceNavigationTiming): void {
    const pageLoad: PageLoadMetric = {
      url: window.location.href,
      loadTime: entry.loadEventEnd - entry.navigationStart,
      domContentLoaded: entry.domContentLoadedEventEnd - entry.navigationStart,
      timestamp: Date.now()
    };

    this.pageLoads.push(pageLoad);
    this.recordMetric('page.load', pageLoad.loadTime);
    this.recordMetric('page.domContentLoaded', pageLoad.domContentLoaded);
  }

  private setupPageLoadMetrics(): void {
    // Record initial page load if already loaded
    if (document.readyState === 'complete') {
      this.recordPageLoad();
    } else {
      window.addEventListener('load', () => this.recordPageLoad());
    }
  }

  private recordPageLoad(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      this.handleNavigationEntry(navigation);
    }
  }

  public recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      tags
    };

    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  public startTimer(name: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
    };
  }

  public measureFunction<T>(name: string, fn: () => T): T {
    const stopTimer = this.startTimer(name);
    try {
      const result = fn();
      if (result instanceof Promise) {
        return result.finally(stopTimer) as T;
      }
      stopTimer();
      return result;
    } catch (error) {
      stopTimer();
      throw error;
    }
  }

  public recordUserAction(action: string, metadata?: Record<string, any>): void {
    this.recordMetric(`user.${action}`, 1, {
      ...metadata,
      timestamp: new Date().toISOString()
    });
  }

  public getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(metric => metric.name === name);
    }
    return [...this.metrics];
  }

  public getPageLoadMetrics(): PageLoadMetric[] {
    return [...this.pageLoads];
  }

  public getAverageMetric(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;
    
    const sum = metrics.reduce((total, metric) => total + metric.value, 0);
    return sum / metrics.length;
  }

  public getPerformanceSummary(): {
    averagePageLoad: number;
    averageDomContentLoaded: number;
    totalMetrics: number;
    slowestPageLoad?: PageLoadMetric;
  } {
    const avgPageLoad = this.getAverageMetric('page.load');
    const avgDom = this.getAverageMetric('page.domContentLoaded');
    
    const slowestLoad = this.pageLoads.reduce((slowest, current) => {
      return current.loadTime > (slowest?.loadTime || 0) ? current : slowest;
    }, undefined as PageLoadMetric | undefined);

    return {
      averagePageLoad: avgPageLoad,
      averageDomContentLoaded: avgDom,
      totalMetrics: this.metrics.length,
      slowestPageLoad: slowestLoad
    };
  }

  public exportMetrics(): string {
    return JSON.stringify({
      metrics: this.metrics,
      pageLoads: this.pageLoads,
      summary: this.getPerformanceSummary()
    }, null, 2);
  }

  public clearMetrics(): void {
    this.metrics = [];
    this.pageLoads = [];
  }
}

export default new PerformanceMonitoringService();
