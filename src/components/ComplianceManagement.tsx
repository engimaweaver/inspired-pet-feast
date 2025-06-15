
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Shield, FileText, Download, Calendar, CheckCircle, AlertTriangle, Clock, Users } from 'lucide-react';

interface ComplianceStandard {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'partial' | 'non-compliant';
  score: number;
  lastAudit: string;
  nextAudit: string;
  requirements: ComplianceRequirement[];
}

interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  status: 'met' | 'partial' | 'not-met';
  evidence: string[];
  lastReviewed: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  standard: string;
  action: string;
  user: string;
  details: string;
}

const complianceStandards: ComplianceStandard[] = [
  {
    id: 'gdpr',
    name: 'GDPR Compliance',
    description: 'General Data Protection Regulation compliance for EU customers',
    status: 'compliant',
    score: 98,
    lastAudit: '2024-01-15',
    nextAudit: '2024-07-15',
    requirements: [
      {
        id: 'gdpr-1',
        title: 'Data Processing Legal Basis',
        description: 'Ensure all data processing has a valid legal basis',
        status: 'met',
        evidence: ['privacy-policy.pdf', 'consent-forms.pdf'],
        lastReviewed: '2024-01-15'
      },
      {
        id: 'gdpr-2',
        title: 'Right to Erasure',
        description: 'Implement customer data deletion functionality',
        status: 'met',
        evidence: ['data-deletion-process.pdf'],
        lastReviewed: '2024-01-15'
      },
      {
        id: 'gdpr-3',
        title: 'Data Breach Notification',
        description: 'Establish 72-hour breach notification procedures',
        status: 'met',
        evidence: ['incident-response-plan.pdf'],
        lastReviewed: '2024-01-15'
      }
    ]
  },
  {
    id: 'pci-dss',
    name: 'PCI DSS',
    description: 'Payment Card Industry Data Security Standard',
    status: 'compliant',
    score: 96,
    lastAudit: '2024-01-10',
    nextAudit: '2024-07-10',
    requirements: [
      {
        id: 'pci-1',
        title: 'Secure Network',
        description: 'Install and maintain firewall configuration',
        status: 'met',
        evidence: ['firewall-config.pdf', 'network-diagram.pdf'],
        lastReviewed: '2024-01-10'
      },
      {
        id: 'pci-2',
        title: 'Encrypt Cardholder Data',
        description: 'Protect stored cardholder data with encryption',
        status: 'met',
        evidence: ['encryption-policy.pdf'],
        lastReviewed: '2024-01-10'
      }
    ]
  },
  {
    id: 'fssai',
    name: 'FSSAI Standards',
    description: 'Food Safety and Standards Authority of India compliance',
    status: 'compliant',
    score: 100,
    lastAudit: '2024-01-20',
    nextAudit: '2024-07-20',
    requirements: [
      {
        id: 'fssai-1',
        title: 'Food Safety License',
        description: 'Valid FSSAI license for all locations',
        status: 'met',
        evidence: ['fssai-license.pdf'],
        lastReviewed: '2024-01-20'
      },
      {
        id: 'fssai-2',
        title: 'Hygiene Standards',
        description: 'Maintain hygiene and sanitation standards',
        status: 'met',
        evidence: ['hygiene-checklist.pdf', 'training-records.pdf'],
        lastReviewed: '2024-01-20'
      }
    ]
  }
];

const auditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: '2024-01-20T10:30:00Z',
    standard: 'FSSAI Standards',
    action: 'Audit Completed',
    user: 'Compliance Officer',
    details: 'Annual FSSAI compliance audit completed with 100% score'
  },
  {
    id: '2',
    timestamp: '2024-01-15T14:20:00Z',
    standard: 'GDPR Compliance',
    action: 'Policy Updated',
    user: 'Legal Team',
    details: 'Privacy policy updated to include new data processing activities'
  },
  {
    id: '3',
    timestamp: '2024-01-10T09:15:00Z',
    standard: 'PCI DSS',
    action: 'Security Assessment',
    user: 'Security Team',
    details: 'Quarterly security assessment completed successfully'
  }
];

const ComplianceManagement = () => {
  const [selectedStandard, setSelectedStandard] = useState<string>('gdpr');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'met':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'partial':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'non-compliant':
      case 'not-met':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'met':
        return 'default';
      case 'partial':
        return 'secondary';
      case 'non-compliant':
      case 'not-met':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const overallScore = Math.round(
    complianceStandards.reduce((sum, std) => sum + std.score, 0) / complianceStandards.length
  );

  const compliantStandards = complianceStandards.filter(std => std.status === 'compliant').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compliance Management</h1>
          <p className="text-gray-600">Regulatory compliance and audit management system</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Compliance Report
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallScore}%</div>
            <Progress value={overallScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliant Standards</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{compliantStandards}/{complianceStandards.length}</div>
            <p className="text-xs text-muted-foreground">Standards in compliance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Audits</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Next 6 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentation</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Documents managed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="standards" className="space-y-6">
        <TabsList>
          <TabsTrigger value="standards">Compliance Standards</TabsTrigger>
          <TabsTrigger value="audits">Audit Management</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="training">Training & Awareness</TabsTrigger>
        </TabsList>

        <TabsContent value="standards" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Standards List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Standards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {complianceStandards.map((standard) => (
                      <div
                        key={standard.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedStandard === standard.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedStandard(standard.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(standard.status)}
                            <span className="font-medium">{standard.name}</span>
                          </div>
                          <Badge variant={getStatusColor(standard.status) as any}>
                            {standard.score}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Standard Details */}
            <div className="lg:col-span-2">
              {(() => {
                const standard = complianceStandards.find(s => s.id === selectedStandard);
                if (!standard) return null;

                return (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{standard.name}</CardTitle>
                          <CardDescription>{standard.description}</CardDescription>
                        </div>
                        <Badge variant={getStatusColor(standard.status) as any}>
                          {standard.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Last Audit</p>
                            <p className="text-lg">{new Date(standard.lastAudit).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Next Audit</p>
                            <p className="text-lg">{new Date(standard.nextAudit).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Requirements</h4>
                          <div className="space-y-3">
                            {standard.requirements.map((req) => (
                              <div key={req.id} className="border rounded-lg p-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      {getStatusIcon(req.status)}
                                      <h5 className="font-medium">{req.title}</h5>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{req.description}</p>
                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                      <span>Last reviewed: {new Date(req.lastReviewed).toLocaleDateString()}</span>
                                      <span>Evidence: {req.evidence.length} documents</span>
                                    </div>
                                  </div>
                                  <Badge variant={getStatusColor(req.status) as any}>
                                    {req.status.replace('-', ' ')}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Schedule</CardTitle>
              <CardDescription>Upcoming and completed compliance audits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceStandards.map((standard) => (
                  <div key={standard.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{standard.name}</h4>
                      <p className="text-sm text-gray-600">
                        Last audit: {new Date(standard.lastAudit).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Next: {new Date(standard.nextAudit).toLocaleDateString()}</p>
                      <Badge variant={getStatusColor(standard.status) as any}>
                        Score: {standard.score}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audit History</CardTitle>
              <CardDescription>Recent audit activities and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{log.action}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{log.standard}</p>
                      <p className="text-sm">{log.details}</p>
                      <p className="text-xs text-gray-500 mt-1">By: {log.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Documentation</CardTitle>
              <CardDescription>Centralized document management for compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Privacy Policy', type: 'PDF', size: '245 KB', updated: '2024-01-15' },
                  { name: 'Data Processing Agreement', type: 'PDF', size: '189 KB', updated: '2024-01-10' },
                  { name: 'Security Assessment Report', type: 'PDF', size: '1.2 MB', updated: '2024-01-08' },
                  { name: 'FSSAI License', type: 'PDF', size: '156 KB', updated: '2024-01-20' },
                  { name: 'Employee Training Records', type: 'XLSX', size: '89 KB', updated: '2024-01-18' },
                  { name: 'Incident Response Plan', type: 'PDF', size: '345 KB', updated: '2024-01-12' }
                ].map((doc, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <h4 className="font-medium text-sm">{doc.name}</h4>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Type: {doc.type} • Size: {doc.size}</p>
                      <p>Updated: {doc.updated}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Training</CardTitle>
              <CardDescription>Staff training and awareness programs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: 'GDPR Data Protection Training', completion: 95, enrolled: 42, completed: 40 },
                  { title: 'PCI DSS Security Awareness', completion: 88, enrolled: 35, completed: 31 },
                  { title: 'Food Safety Standards', completion: 100, enrolled: 28, completed: 28 },
                  { title: 'Incident Response Procedures', completion: 76, enrolled: 38, completed: 29 }
                ].map((training, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{training.title}</h4>
                      <Badge variant={training.completion === 100 ? 'default' : 'secondary'}>
                        {training.completion}% Complete
                      </Badge>
                    </div>
                    <Progress value={training.completion} className="mb-2" />
                    <p className="text-sm text-gray-600">
                      {training.completed}/{training.enrolled} staff members completed
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceManagement;
