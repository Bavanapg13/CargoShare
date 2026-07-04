'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('user');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello, I saw your listing for space from Mumbai to London.', sender: 'them', time: '10:00 AM' },
    { id: 2, text: 'Hi! Yes, we have about 800kg of space left on that flight. Are you interested in booking?', sender: 'me', time: '10:05 AM' },
    { id: 3, text: 'Yes, I have some electronics. Do you provide temperature controlled storage?', sender: 'them', time: '10:12 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setMessages([...messages, {
      id: Date.now(),
      text: newMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setNewMessage('');
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        
        <Card className="flex-1 flex overflow-hidden">
          {/* Contacts Sidebar */}
          <div className="w-1/3 border-r border-border flex flex-col">
            <div className="p-4 border-b border-border font-semibold">Conversations</div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 border-b border-border bg-primary/5 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="font-medium flex justify-between">
                  <span>Global Freight Ltd</span>
                  <span className="text-xs text-muted-foreground">10:12 AM</span>
                </div>
                <div className="text-sm text-muted-foreground truncate mt-1">Yes, I have some electronics...</div>
              </div>
              <div className="p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="font-medium flex justify-between">
                  <span>Speedy Roadways</span>
                  <span className="text-xs text-muted-foreground">Yesterday</span>
                </div>
                <div className="text-sm text-muted-foreground truncate mt-1">Your booking has been confirmed.</div>
              </div>
            </div>
          </div>
          
          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-background/50">
            <div className="p-4 border-b border-border bg-card flex justify-between items-center">
              <div>
                <div className="font-bold">Global Freight Ltd</div>
                <div className="text-xs text-green-500">● Online</div>
              </div>
              <Button variant="outline" size="sm">View Profile</Button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              <div className="text-center text-xs text-muted-foreground my-4">Today</div>
              
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl p-3 ${
                    msg.sender === 'me' 
                      ? 'bg-primary text-primary-foreground rounded-br-sm' 
                      : 'bg-muted border border-border rounded-bl-sm'
                  }`}>
                    <div className="text-sm">{msg.text}</div>
                    <div className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-card border-t border-border">
              <form onSubmit={handleSend} className="flex gap-2">
                <button type="button" className="p-2 text-muted-foreground hover:text-foreground">
                  📎
                </button>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-full border border-border bg-background px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button type="submit" className="rounded-full px-6">Send</Button>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
