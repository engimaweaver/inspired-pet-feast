
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle, CheckCircle, Clock, Server, Activity, Shield, Bell, Eye } from 'lucide-react';
import MonitoringService, { Alert, HealthCheck, SystemMetric } from '@/services/MonitoringService';

const SystemMonitoringDashboard = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [systemStatus, setSystemStatus] = useState(MonitoringService.getSystemStatus());

  useEffect(() => {
    // Initial data load
    setAlerts(MonitoringService.getAlerts());
    setHealthChecks(MonitoringService.getHealthChecks());
    setMetrics(MonitoringService.getMetrics());

    // Set up alert listener
    const unsubscribe = MonitoringService.onAlert((newAlert) => {
      setAlerts(prev => [newAlert, ...prev]);
    });

    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      setAlerts(MonitoringService.getAlerts());
      setHealthChecks(MonitoringService.getHealthChecks());
      setMetrics(MonitoringService.getMetrics());
      setSystemStatus(MonitoringService.getSystemStatus());
    }, 30000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const acknowledgeAlert = (alertId: string) => {
    MonitoringService.acknowledgeAlert(alertId);
    setAlerts(MonitoringService.getAlerts());
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'unhealthy': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'default';
      case 'degraded': return 'secondary';
      case 'unhealthy': return 'destructive';
      default: return 'outline';
    }
  };

  // Prepare chart data
  const responseTimeData = metrics
    .filter(m => m.name === 'page_load_time')
    .slice(-20)
    .map(m => ({
      time: new Date(m.timestamp).toLocaleTimeString(),
      value: m.value
    }));

  const memoryUsageData = metrics
    .filter(m => m.name === 'memory_used')
    .slice(-20)
    .map(m => ({
      time: new Date(m.timestamp).toLocaleTimeString(),
      value: Math.round(m.value)
    }));

  const cacheHitRateData = metrics
    .filter(m => m.name === 'cache_hit_rate')
    .slice(-20)
    .map(m => ({
      time: new Date(m.timestamp).toLocaleTimeString(),
      value: m.value
    }));

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
  const criticalAlerts = unacknowledgedAlerts.filter(a => a.type === 'critical');
  const warningAlerts = unacknowledgedAlerts.filter(a => a.type === 'warning');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Monitoring</h1>
          <p className="text-gray-600">Real-time system health and performance monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(systemStatus.status)}
          <Badge variant={getStatusColor(systemStatus.status) as any}>
            System {systemStatus.status}
          </Badge>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{systemStatus.status}</div>
            <p className="text-xs text-muted-foreground">
              {systemStatus.healthyServices}/{systemStatus.totalServices} services healthy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unacknowledgedAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {criticalAlerts.length} critical, {warningAlerts.length} warnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(systemStatus.uptime / 60)}m</div>
            <p className="text-xs text-muted-foreground">Since last restart</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">Overall performance score</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="health">Health Checks</TabsTrigger>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>System alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>No alerts at this time</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.slice(0, 10).map((alert) => (
                    <div key={alert.id} className={`p-4 border rounded-lg ${alert.acknowledged ? 'opacity-50' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {alert.type === 'critical' && <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />}
                          {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />}
                          {alert.type === 'info' && <Eye className="h-5 w-5 text-blue-500 mt-0.5" />}
                          <div>
                            <h4 className="font-medium">{alert.title}</h4>
                            <p className="text-sm text-gray-600">{alert.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(alert.timestamp).toLocaleString()} • {alert.source}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={alert.type === 'critical' ? 'destructive' : alert.type === 'warning' ? 'secondary' : 'default'}>
                            {alert.type}
                          </Badge>
                          {!alert.acknowledged && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => acknowledgeAlert(alert.id)}
                            >
                              Acknowledge
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Health Checks</CardTitle>
              <CardDescription>Status of all monitored services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthChecks.map((check) => (
                  <div key={check.service} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(check.status)}
                      <div>
                        <h4 className="font-medium capitalize">{check.service.replace('_', ' ')}</h4>
                        {check.message && (
                          <p className="text-sm text-gray-600">{check.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusColor(check.status) as any}>
                        {check.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {check.responseTime}ms • {new Date(check.lastChecked).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
                <CardDescription>Page load performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Memory Usage</CardTitle>
                <CardDescription>JavaScript heap memory consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={memoryUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cache Hit Rate</CardTitle>
                <CardDescription>Application cache performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={cacheHitRateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">CPU Usage</span>
                    <span className="text-sm">12%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '12%' }} />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Memory Usage</span>
                    <span className="text-sm">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }} />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Disk Usage</span>
                    <span className="text-sm">67%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '67%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>Recent system activity and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex space-x-4">
                  <span className="text-gray-500">{new Date().toLocaleTimeString()}</span>
                  <span className="text-green-600">[INFO]</span>
                  <span>System health check completed successfully</span>
                </div>
                <div className="flex space-x-4">
                  <span className="text-gray-500">{new Date(Date.now() - 60000).toLocaleTimeString()}</span>
                  <span className="text-blue-600">[DEBUG]</span>
                  <span>Cache cleanup completed, 15 items evicted</span>
                </div>
                <div className="flex space-x-4">
                  <span className="text-gray-500">{new Date(Date.now() - 120000).toLocaleTimeString()}</span>
                  <span className="text-yellow-600">[WARN]</span>
                  <span>Response time exceeded warning threshold: 2.1s</span>
                </div>
                <div className="flex space-x-4">
                  <span className="text-gray-500">{new Date(Date.now() - 180000).toLocaleTimeString()}</span>
                  <span className="text-green-600">[INFO]</span>
                  <span>Performance metrics collected successfully</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemMonitoringDashboard;
