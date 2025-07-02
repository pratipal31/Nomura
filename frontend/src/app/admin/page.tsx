"use client"

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, Mic, Plus, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [template, setTemplate] = useState('');
  const [date, setDate] = useState('');
  const [place, setPlace] = useState('');
  const [adminId] = useState(1); // Static admin for now

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch('http://localhost:5000/get-events');
    const data = await res.json();
    if (data.success) setEvents(data.events);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setTemplate('');
    const res = await fetch('http://localhost:5000/generate-event-template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) setTemplate(data.template);
  };

  const handleCreateEvent = async () => {
    if (!date || !place || !template) return;
    await fetch('http://localhost:5000/create-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_id: adminId, date, place, template, image: '' })
    });
    setPrompt('');
    setTemplate('');
    setDate('');
    setPlace('');
    fetchEvents();
  };

  const handleMicInput = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/speech-to-text');
      const data = await res.json();
      if (data.success) setPrompt(data.text);
    } catch (err) {
      alert('Microphone access failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-3xl font-bold">🌊 Admin Dashboard - Beach Cleanup</h1>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Manage Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">12</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Waste Collected</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">356 kg</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Events</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">{events.length}</CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="space-y-4 p-4">
              <h2 className="text-xl font-bold">🎤 Create Event From Prompt</h2>
              <Label>Prompt</Label>
              <div className="flex gap-2">
                <Input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g. Clean drive for Versova beach..." />
                <Button onClick={handleMicInput} variant="outline"><Mic className="w-4 h-4" /></Button>
              </div>
              <Button onClick={handleGenerate} disabled={loading} className="bg-blue-600 text-white">
                {loading ? <><Loader2 className="animate-spin w-4 h-4 mr-2" />Generating...</> : 'Generate Template'}
              </Button>
              {template && (
                <Textarea rows={8} value={template} onChange={e => setTemplate(e.target.value)} className="w-full" />
              )}
              <Label>Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
              <Label>Place</Label>
              <Input placeholder="e.g. Juhu Beach" value={place} onChange={e => setPlace(e.target.value)} />
              <Button onClick={handleCreateEvent} className="w-full bg-green-600 text-white">📅 Create Event</Button>
            </Card>

            <Card className="p-4">
              <h2 className="text-xl font-bold mb-4">🗂️ Existing Events</h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {events.map(ev => (
                  <div key={ev.event_id} className="border p-3 rounded-md space-y-1">
                    <div className="text-sm text-gray-600">#{ev.event_id} - {new Date(ev.date).toDateString()}</div>
                    <div className="font-semibold">📍 {ev.place}</div>
                    <Textarea rows={3} value={ev.template} readOnly className="text-sm bg-gray-100" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
