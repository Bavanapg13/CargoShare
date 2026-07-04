'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User } from '@/lib/data';

export default function AdminApprovalsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLsp, setSelectedLsp] = useState<User | null>(null);
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [checklist, setChecklist] = useState({
    documents: false,
    fleet: false,
    quality: false,
  });

  const fetchUsers = () => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const pendingLSPs = users.filter(u => u.role === 'lsp' && u.status === 'pending');

  const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
    if (!selectedLsp) return;
    
    if (status === 'approved' && (!checklist.documents || !checklist.fleet || !checklist.quality)) {
      alert('Please complete all checklist items before approving.');
      return;
    }

    try {
      const res = await fetch(`/api/users/${selectedLsp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, inspectionNotes }),
      });

      if (res.ok) {
        fetchUsers();
        setSelectedLsp(null);
        setInspectionNotes('');
        setChecklist({ documents: false, fleet: false, quality: false });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Pending LSP Approvals</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Queue</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {pendingLSPs.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">Queue is empty</div>
              ) : (
                <ul className="divide-y divide-border">
                  {pendingLSPs.map(lsp => (
                    <li 
                      key={lsp.id} 
                      className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedLsp?.id === lsp.id ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
                      onClick={() => {
                        setSelectedLsp(lsp);
                        setChecklist({ documents: false, fleet: false, quality: false });
                      }}
                    >
                      <div className="font-semibold">{lsp.companyName}</div>
                      <div className="text-xs text-muted-foreground mt-1">{lsp.email}</div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedLsp ? (
            <Card className="h-full">
              <CardHeader className="pb-4 border-b border-border">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{selectedLsp.companyName}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Contact: {selectedLsp.name} ({selectedLsp.phone})</p>
                  </div>
                  <Badge variant="warning">Pending Inspection</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Transport Modes</h4>
                  <div className="flex gap-2">
                    {selectedLsp.transportMode?.map(m => (
                      <Badge key={m} variant="default" className="capitalize px-3 py-1 text-sm">{m}</Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-3">Inspection Checklist</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={checklist.documents}
                        onChange={(e) => setChecklist({...checklist, documents: e.target.checked})}
                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                      />
                      <span>Business Licenses & Tax Documents Verified</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={checklist.fleet}
                        onChange={(e) => setChecklist({...checklist, fleet: e.target.checked})}
                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                      />
                      <span>Fleet Details & Container Yard Locations Confirmed</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={checklist.quality}
                        onChange={(e) => setChecklist({...checklist, quality: e.target.checked})}
                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                      />
                      <span>Service Quality & Data Completeness Score Pass</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Inspection Notes / Remarks</label>
                  <textarea 
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                    placeholder="Add mandatory notes regarding document review and risk assessment..."
                    value={inspectionNotes}
                    onChange={(e) => setInspectionNotes(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex space-x-4 pt-4 border-t border-border">
                  <Button 
                    variant="success" 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleStatusUpdate('approved')}
                  >
                    Approve & Activate
                  </Button>
                  <Button 
                    variant="danger" 
                    className="flex-1"
                    onClick={() => handleStatusUpdate('rejected')}
                  >
                    Reject Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center p-12 border-2 border-dashed border-border rounded-xl bg-card text-muted-foreground">
              Select an application from the queue to review
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
