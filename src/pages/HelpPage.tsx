
import React, { useState } from 'react';
import { StandardizedCard } from '@/components/ui/standardized-card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, HelpCircle, Book, Video, MessageCircle, ExternalLink } from 'lucide-react';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqData = [
    {
      id: '1',
      question: 'How do I process a new order?',
      answer: 'To process a new order, go to the Billing section, select menu items, add customer details, and process payment.',
      category: 'orders'
    },
    {
      id: '2',
      question: 'How can I add new menu items?',
      answer: 'Navigate to Menu Management, click "Add Item", fill in the details including name, price, category, and save.',
      category: 'menu'
    },
    {
      id: '3',
      question: 'How do I manage inventory?',
      answer: 'Go to Inventory Management to view stock levels, update quantities, and set low stock alerts.',
      category: 'inventory'
    },
    {
      id: '4',
      question: 'How can I view sales reports?',
      answer: 'Access Analytics & Reports from the main menu to view daily, weekly, and monthly sales reports.',
      category: 'reports'
    }
  ];

  const tutorials = [
    {
      id: '1',
      title: 'Getting Started with RestaurantOS',
      duration: '5 min',
      type: 'video',
      description: 'Learn the basics of using RestaurantOS'
    },
    {
      id: '2',
      title: 'Processing Your First Order',
      duration: '3 min',
      type: 'guide',
      description: 'Step-by-step guide to billing and payment'
    },
    {
      id: '3',
      title: 'Setting Up Your Menu',
      duration: '7 min',
      type: 'video',
      description: 'How to add and organize menu items'
    }
  ];

  const quickLinks = [
    { label: 'User Manual', icon: <Book className="h-4 w-4" />, href: '#' },
    { label: 'Video Tutorials', icon: <Video className="h-4 w-4" />, href: '#' },
    { label: 'Contact Support', icon: <MessageCircle className="h-4 w-4" />, href: '#' },
    { label: 'Feature Requests', icon: <ExternalLink className="h-4 w-4" />, href: '#' }
  ];

  const filteredFAQs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <HelpCircle className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Help & Documentation</h1>
          <p className="text-gray-600">Find answers and learn how to use RestaurantOS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickLinks.map((link, index) => (
          <StandardizedCard key={index} className="hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                {link.icon}
              </div>
              <div>
                <p className="font-medium">{link.label}</p>
                <ExternalLink className="h-3 w-3 text-gray-400" />
              </div>
            </div>
          </StandardizedCard>
        ))}
      </div>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="guides">User Guides</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search FAQ..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <StandardizedCard title="Frequently Asked Questions">
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <span>{faq.question}</span>
                      <Badge variant="outline" className="text-xs">
                        {faq.category}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </StandardizedCard>
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-4">
          <StandardizedCard title="Video Tutorials & Guides">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tutorials.map((tutorial) => (
                <div key={tutorial.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      {tutorial.type === 'video' ? <Video className="h-5 w-5" /> : <Book className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{tutorial.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{tutorial.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {tutorial.type}
                        </Badge>
                        <span className="text-xs text-gray-500">{tutorial.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </StandardizedCard>
        </TabsContent>

        <TabsContent value="guides" className="space-y-4">
          <StandardizedCard title="User Guides">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Quick Start Guide</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Essential steps to get your restaurant running with RestaurantOS
                </p>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Complete your restaurant profile setup</li>
                  <li>2. Add your menu items and categories</li>
                  <li>3. Set up your tables and floor plan</li>
                  <li>4. Process your first order</li>
                  <li>5. Review daily reports</li>
                </ol>
              </div>
            </div>
          </StandardizedCard>
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <StandardizedCard title="Contact Support">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Get Help</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Live Chat</p>
                      <p className="text-sm text-gray-600">Available 24/7</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-gray-600">support@restaurantos.com</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">System Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">All Systems</span>
                    <Badge className="bg-green-100 text-green-800">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Updated</span>
                    <span className="text-sm text-gray-600">2 minutes ago</span>
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

export default HelpPage;
