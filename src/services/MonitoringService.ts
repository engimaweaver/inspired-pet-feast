export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  source: string;
  acknowledged: boolean;
  metadata?: Record<string, any>;
}

export interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  tags: Record<string, string>;
}

export interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  message?: string;
  lastChecked: string;
}

export interface PerformanceThreshold {
  metric: string;
  warning: number;
  critical: number;
  unit: string;
}

class MonitoringService {
  private alerts: Alert[] = [];
  private metrics: SystemMetric[] = [];
  private healthChecks: Map<string, HealthCheck> = new Map();
  private thresholds: PerformanceThreshold[] = [
    { metric: 'response_time', warning: 2000, critical: 5000, unit: 'ms' },
    { metric: 'memory_usage', warning: 80, critical: 95, unit: '%' },
    { metric: 'cpu_usage', warning: 70, critical: 90, unit: '%' },
    { metric: 'error_rate', warning: 5, critical: 10, unit: '%' },
    { metric: 'cache_hit_rate', warning: 80, critical: 60, unit: '%' }
  ];

  private monitoringInterval?: NodeJS.Timeout;
  private alertCallbacks: ((alert: Alert) => void)[] = [];

  constructor() {
    this.startMonitoring();
    this.initializeHealthChecks();
  }

  private startMonitoring(): void {
    // Monitor system metrics every 30 seconds
    this.monitoringInterval = setInterval(() => {
      this.collectSystemMetrics();
      this.checkThresholds();
      this.performHealthChecks();
    }, 30000);

    // Initial check
    this.collectSystemMetrics();
    this.performHealthChecks();
  }

  private collectSystemMetrics(): void {
    const timestamp = new Date().toISOString();

    // Collect performance metrics
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      this.recordMetric('memory_used', memInfo.usedJSHeapSize / 1024 / 1024, 'MB', { type: 'javascript_heap' });
      this.recordMetric('memory_total', memInfo.totalJSHeapSize / 1024 / 1024, 'MB', { type: 'javascript_heap' });
    }

    // Collect navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      this.recordMetric('page_load_time', navigation.loadEventEnd - navigation.startTime, 'ms', { page: window.location.pathname });
      this.recordMetric('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.startTime, 'ms', { page: window.location.pathname });
    }

    // Collect cache metrics
    this.collectCacheMetrics();

    // Collect error metrics
    this.collectErrorMetrics();

    // Keep only recent metrics (last hour)
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    this.metrics = this.metrics.filter(metric => 
      new Date(metric.timestamp).getTime() > oneHourAgo
    );
  }

  private collectCacheMetrics(): void {
    // This would integrate with AdvancedCachingService
    try {
      const cacheService = require('./AdvancedCachingService').default;
      const stats = cacheService.getStats();
      
      this.recordMetric('cache_hit_rate', stats.hitRate, '%', { type: 'application_cache' });
      this.recordMetric('cache_size', stats.totalSize / 1024 / 1024, 'MB', { type: 'application_cache' });
      this.recordMetric('cache_items', stats.totalItems, 'count', { type: 'application_cache' });
    } catch (error) {
      // Cache service not available
    }
  }

  private collectErrorMetrics(): void {
    // This would integrate with LoggingService
    try {
      const loggingService = require('./LoggingService').default;
      const errorLogs = loggingService.getLogs('error');
      const recentErrors = errorLogs.filter(log => 
        Date.now() - new Date(log.timestamp).getTime() < 60 * 60 * 1000 // last hour
      );
      
      this.recordMetric('error_count', recentErrors.length, 'count', { type: 'application_errors' });
    } catch (error) {
      // Logging service not available
    }
  }

  private checkThresholds(): void {
    this.thresholds.forEach(threshold => {
      const recentMetrics = this.getRecentMetrics(threshold.metric, 5); // last 5 minutes
      if (recentMetrics.length === 0) return;

      const latestValue = recentMetrics[recentMetrics.length - 1].value;
      
      if (latestValue >= threshold.critical) {
        this.createAlert('critical', 
          `Critical: ${threshold.metric}`,
          `${threshold.metric} is at ${latestValue}${threshold.unit}, exceeding critical threshold of ${threshold.critical}${threshold.unit}`,
          'system_monitor'
        );
      } else if (latestValue >= threshold.warning) {
        this.createAlert('warning',
          `Warning: ${threshold.metric}`,
          `${threshold.metric} is at ${latestValue}${threshold.unit}, exceeding warning threshold of ${threshold.warning}${threshold.unit}`,
          'system_monitor'
        );
      }
    });
  }

  private performHealthChecks(): void {
    const checks = [
      { name: 'frontend', url: window.location.origin },
      { name: 'local_storage', test: () => localStorage.setItem('health_check', 'ok') },
      { name: 'session_storage', test: () => sessionStorage.setItem('health_check', 'ok') }
    ];

    checks.forEach(check => {
      const startTime = Date.now();
      let status: HealthCheck['status'] = 'healthy';
      let message = '';

      try {
        if ('test' in check) {
          check.test();
        } else if ('url' in check) {
          // For URL checks, we'll simulate based on current status
          // In a real implementation, this would be an actual HTTP check
        }
      } catch (error) {
        status = 'unhealthy';
        message = error instanceof Error ? error.message : 'Health check failed';
      }

      const responseTime = Date.now() - startTime;
      
      this.healthChecks.set(check.name, {
        service: check.name,
        status,
        responseTime,
        message,
        lastChecked: new Date().toISOString()
      });
    });
  }

  private initializeHealthChecks(): void {
    // Initialize with default healthy status
    const services = ['frontend', 'local_storage', 'session_storage'];
    services.forEach(service => {
      this.healthChecks.set(service, {
        service,
        status: 'healthy',
        responseTime: 0,
        lastChecked: new Date().toISOString()
      });
    });
  }

  public recordMetric(name: string, value: number, unit: string, tags: Record<string, string> = {}): void {
    const metric: SystemMetric = {
      name,
      value,
      unit,
      timestamp: new Date().toISOString(),
      tags
    };

    this.metrics.push(metric);
  }

  public createAlert(type: Alert['type'], title: string, message: string, source: string, metadata?: Record<string, any>): void {
    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      source,
      acknowledged: false,
      metadata
    };

    this.alerts.push(alert);
    
    // Notify alert callbacks
    this.alertCallbacks.forEach(callback => callback(alert));

    // Keep only recent alerts (last 24 hours)
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    this.alerts = this.alerts.filter(alert => 
      new Date(alert.timestamp).getTime() > oneDayAgo
    );
  }

  public getAlerts(type?: Alert['type']): Alert[] {
    return type ? this.alerts.filter(alert => alert.type === type) : [...this.alerts];
  }

  public acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  public getMetrics(name?: string, timeRange?: { start: string; end: string }): SystemMetric[] {
    let filtered = name ? this.metrics.filter(m => m.name === name) : [...this.metrics];

    if (timeRange) {
      const start = new Date(timeRange.start).getTime();
      const end = new Date(timeRange.end).getTime();
      filtered = filtered.filter(m => {
        const timestamp = new Date(m.timestamp).getTime();
        return timestamp >= start && timestamp <= end;
      });
    }

    return filtered;
  }

  public getRecentMetrics(name: string, minutes: number): SystemMetric[] {
    const cutoff = Date.now() - minutes * 60 * 1000;
    return this.metrics.filter(metric => 
      metric.name === name && new Date(metric.timestamp).getTime() > cutoff
    );
  }

  public getHealthChecks(): HealthCheck[] {
    return Array.from(this.healthChecks.values());
  }

  public getSystemStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    uptime: number;
    alertCount: { critical: number; warning: number; info: number };
    healthyServices: number;
    totalServices: number;
  } {
    const alerts = this.getAlerts();
    const healthChecks = this.getHealthChecks();
    const unhealthyServices = healthChecks.filter(hc => hc.status === 'unhealthy').length;
    const degradedServices = healthChecks.filter(hc => hc.status === 'degraded').length;

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (unhealthyServices > 0 || alerts.some(a => a.type === 'critical' && !a.acknowledged)) {
      status = 'unhealthy';
    } else if (degradedServices > 0 || alerts.some(a => a.type === 'warning' && !a.acknowledged)) {
      status = 'degraded';
    }

    return {
      status,
      uptime: performance.now() / 1000, // seconds since page load
      alertCount: {
        critical: alerts.filter(a => a.type === 'critical' && !a.acknowledged).length,
        warning: alerts.filter(a => a.type === 'warning' && !a.acknowledged).length,
        info: alerts.filter(a => a.type === 'info' && !a.acknowledged).length
      },
      healthyServices: healthChecks.filter(hc => hc.status === 'healthy').length,
      totalServices: healthChecks.length
    };
  }

  public onAlert(callback: (alert: Alert) => void): () => void {
    this.alertCallbacks.push(callback);
    return () => {
      const index = this.alertCallbacks.indexOf(callback);
      if (index > -1) {
        this.alertCallbacks.splice(index, 1);
      }
    };
  }

  public updateThresholds(thresholds: PerformanceThreshold[]): void {
    this.thresholds = thresholds;
  }

  public exportMonitoringData(): string {
    return JSON.stringify({
      alerts: this.alerts,
      metrics: this.metrics,
      healthChecks: Array.from(this.healthChecks.entries()),
      thresholds: this.thresholds,
      systemStatus: this.getSystemStatus()
    }, null, 2);
  }

  public destroy(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    this.alertCallbacks = [];
  }
}

export default new MonitoringService();
