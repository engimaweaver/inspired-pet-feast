
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Mail, Phone, MoreHorizontal } from 'lucide-react';

const staff = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Restaurant Manager',
    email: 'sarah.chen@restaurant.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
    shift: 'Day Shift',
    joinDate: '2023-01-15',
    initials: 'SC'
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    role: 'Head Chef',
    email: 'marcus.r@restaurant.com',
    phone: '+1 (555) 234-5678',
    status: 'active',
    shift: 'Day Shift',
    joinDate: '2022-08-20',
    initials: 'MR'
  },
  {
    id: 3,
    name: 'Emily Johnson',
    role: 'Server',
    email: 'emily.j@restaurant.com',
    phone: '+1 (555) 345-6789',
    status: 'active',
    shift: 'Evening Shift',
    joinDate: '2023-03-10',
    initials: 'EJ'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Sous Chef',
    email: 'david.kim@restaurant.com',
    phone: '+1 (555) 456-7890',
    status: 'inactive',
    shift: 'Night Shift',
    joinDate: '2022-11-05',
    initials: 'DK'
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    role: 'Server',
    email: 'lisa.t@restaurant.com',
    phone: '+1 (555) 567-8901',
    status: 'active',
    shift: 'Day Shift',
    joinDate: '2023-05-20',
    initials: 'LT'
  }
];

const StaffManagement = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant team and schedules</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{member.phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <Badge className={member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {member.status}
              </Badge>
              <span className="text-sm text-gray-500">{member.shift}</span>
            </div>

            <div className="text-xs text-gray-500 mb-4">
              Joined: {new Date(member.joinDate).toLocaleDateString()}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                View Profile
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Schedule
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
        <div className="space-y-3">
          {staff.filter(member => member.status === 'active').map((member) => (
            <div key={member.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{member.shift}</p>
                <p className="text-xs text-gray-500">
                  {member.shift === 'Day Shift' ? '9:00 AM - 5:00 PM' : 
                   member.shift === 'Evening Shift' ? '5:00 PM - 1:00 AM' : '1:00 AM - 9:00 AM'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
