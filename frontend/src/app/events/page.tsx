/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Clock, ExternalLink } from 'lucide-react';

// Static event data
const eventsData = [
    {
        id: 1,
        title: "Tech Conference 2025",
        description: "Annual technology conference featuring the latest innovations in AI, blockchain, and web development.",
        date: "2025-08-15",
        time: "09:00 AM",
        location: "San Francisco Convention Center",
        address: "747 Howard St, San Francisco, CA 94103",
        lat: 37.7849,
        lng: -122.4094,
        attendees: 500,
        category: "Technology",
        price: "$299",
        organizer: "Tech Events Inc.",
        image: "/api/placeholder/400/200"
    },
    {
        id: 2,
        title: "Digital Marketing Summit",
        description: "Learn the latest digital marketing strategies from industry experts and network with professionals.",
        date: "2025-09-22",
        time: "10:00 AM",
        location: "New York Marriott Marquis",
        address: "1535 Broadway, New York, NY 10036",
        lat: 40.7589,
        lng: -73.9851,
        attendees: 300,
        category: "Marketing",
        price: "$199",
        organizer: "Digital Growth Agency",
        image: "/api/placeholder/400/200"
    },
    {
        id: 3,
        title: "Startup Pitch Competition",
        description: "Emerging startups present their innovative ideas to a panel of investors and industry leaders.",
        date: "2025-10-10",
        time: "02:00 PM",
        location: "Austin Convention Center",
        address: "500 E Cesar Chavez St, Austin, TX 78701",
        lat: 30.2632,
        lng: -97.7431,
        attendees: 200,
        category: "Business",
        price: "Free",
        organizer: "Startup Austin",
        image: "/api/placeholder/400/200"
    },
    {
        id: 4,
        title: "Data Science Workshop",
        description: "Hands-on workshop covering machine learning, data visualization, and statistical analysis techniques.",
        date: "2025-11-05",
        time: "09:30 AM",
        location: "Seattle Center",
        address: "305 Harrison St, Seattle, WA 98109",
        lat: 47.6205,
        lng: -122.3493,
        attendees: 150,
        category: "Education",
        price: "$149",
        organizer: "Data Science Academy",
        image: "/api/placeholder/400/200"
    },
    {
        id: 5,
        title: "Web3 Developer Meetup",
        description: "Connect with blockchain developers and explore the latest trends in decentralized applications.",
        date: "2025-12-01",
        time: "06:00 PM",
        location: "Miami Beach Convention Center",
        address: "1901 Convention Center Dr, Miami Beach, FL 33139",
        lat: 25.7907,
        lng: -80.1300,
        attendees: 250,
        category: "Technology",
        price: "$75",
        organizer: "Blockchain Miami",
        image: "/api/placeholder/400/200"
    }
];

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    address: string;
    lat: number;
    lng: number;
    attendees: number;
    category: string;
    price: string;
    organizer: string;
    image: string;
}

// Google Maps Loader - prevents multiple script loading
class GoogleMapsLoader {
    private static instance: GoogleMapsLoader;
    private loaded = false;
    private loading = false;
    private callbacks: (() => void)[] = [];

    static getInstance(): GoogleMapsLoader {
        if (!GoogleMapsLoader.instance) {
            GoogleMapsLoader.instance = new GoogleMapsLoader();
        }
        return GoogleMapsLoader.instance;
    }

    load(apiKey: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.loaded) {
                resolve();
                return;
            }

            if (this.loading) {
                this.callbacks.push(() => resolve());
                return;
            }

            // Check if already loaded
            if (typeof window !== 'undefined' && window.google && window.google.maps) {
                this.loaded = true;
                resolve();
                return;
            }

            this.loading = true;

            const script = document.createElement('script');
            script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyD3SNq4womYbjcOYoUr-k1k-M25otKHLTQ&libraries=geometry";
            script.async = true;
            script.defer = true;

            script.onload = () => {
                this.loaded = true;
                this.loading = false;
                this.callbacks.forEach(callback => callback());
                this.callbacks = [];
                resolve();
            };

            script.onerror = () => {
                this.loading = false;
                reject(new Error('Failed to load Google Maps'));
            };

            document.head.appendChild(script);
        });
    }

    isLoaded(): boolean {
        return this.loaded;
    }
}

// Google Maps Component
const GoogleMap: React.FC<{
    events: Event[];
    onEventSelect: (event: Event) => void;
}> = ({ events, onEventSelect }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    const initializeMap = useCallback(() => {
        if (!mapRef.current || !window.google || !window.google.maps) return;

        try {
            // Create map
            const map = new window.google.maps.Map(mapRef.current, {
                zoom: 4,
                center: { lat: 39.8283, lng: -98.5795 },
                styles: [
                    {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [{ visibility: 'off' }]
                    }
                ],
                mapTypeControl: true,
                streetViewControl: false,
                fullscreenControl: true,
            });

            mapInstanceRef.current = map;

            // Create info window
            const infoWindow = new window.google.maps.InfoWindow();
            infoWindowRef.current = infoWindow;

            // Add markers
            addMarkers(map, infoWindow);
            setIsLoaded(true);
        } catch (error) {
            console.error('Error initializing map:', error);
            setLoadError('Failed to initialize map');
        }
    }, []);

    const addMarkers = (map: google.maps.Map, infoWindow: google.maps.InfoWindow) => {
        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        events.forEach((event) => {
            const marker = new window.google.maps.Marker({
                position: { lat: event.lat, lng: event.lng },
                map: map,
                title: event.title,
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    fillColor: getCategoryColor(event.category),
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                    scale: 10,
                },
            });

            const contentString = `
        <div style="max-width: 300px; padding: 12px; font-family: system-ui, -apple-system, sans-serif;">
          <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">${event.title}</h3>
          <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px; line-height: 1.4;">${event.description}</p>
          <div style="display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: #6b7280;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px;">📅</span>
              <span><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()} at ${event.time}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px;">📍</span>
              <span><strong>Location:</strong> ${event.location}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px;">👥</span>
              <span><strong>Attendees:</strong> ${event.attendees} people</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px;">💰</span>
              <span><strong>Price:</strong> <span style="color: #2563eb; font-weight: 600;">${event.price}</span></span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px;">🏢</span>
              <span><strong>Organizer:</strong> ${event.organizer}</span>
            </div>
          </div>
          <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
            <button 
              onclick="window.selectEvent(${event.id})" 
              style="background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 500;"
            >
              View Full Details
            </button>
          </div>
        </div>
      `;

            // Add event listeners
            marker.addListener('mouseover', () => {
                infoWindow.setContent(contentString);
                infoWindow.open(map, marker);
            });

            marker.addListener('mouseout', () => {
                // Keep info window open for a short time to allow interaction
                setTimeout(() => {
                    if (!infoWindow.get('isHovered')) {
                        infoWindow.close();
                    }
                }, 100);
            });

            marker.addListener('click', () => {
                onEventSelect(event);
            });

            markersRef.current.push(marker);
        });

        // Global function for info window button clicks
        (window as any).selectEvent = (eventId: number) => {
            const event = events.find(e => e.id === eventId);
            if (event) {
                onEventSelect(event);
                infoWindow.close();
            }
        };
    };

    const getCategoryColor = (category: string): string => {
        const colors: { [key: string]: string } = {
            Technology: '#3B82F6',
            Marketing: '#10B981',
            Business: '#8B5CF6',
            Education: '#F59E0B',
        };
        return colors[category] || '#6B7280';
    };

    useEffect(() => {
        const loadMap = async () => {
            try {
                const loader = GoogleMapsLoader.getInstance();
                await loader.load('YOUR_API_KEY'); // Replace with your actual API key

                // Small delay to ensure DOM is ready
                setTimeout(() => {
                    initializeMap();
                }, 100);
            } catch (error) {
                console.error('Failed to load Google Maps:', error);
                setLoadError('Failed to load Google Maps. Please check your API key.');
            }
        };

        loadMap();

        // Cleanup function
        return () => {
            if (infoWindowRef.current) {
                infoWindowRef.current.close();
            }
            markersRef.current.forEach(marker => {
                if (marker.setMap) {
                    marker.setMap(null);
                }
            });
            delete (window as any).selectEvent;
        };
    }, [initializeMap]);

    if (loadError) {
        return (
            <div className="w-full h-96 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
                <div className="text-center p-6">
                    <div className="text-red-600 mb-2">⚠️ Map Loading Error</div>
                    <p className="text-sm text-red-600 mb-2">{loadError}</p>
                    <p className="text-xs text-gray-600">
                        Make sure to replace &apos;YOUR_API_KEY&apos; with a valid Google Maps API key
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
            <div ref={mapRef} className="w-full h-full" />
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Loading Google Maps...</p>
                        <p className="text-xs text-gray-500 mt-1">
                            Replace YOUR_API_KEY with your Google Maps API key
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

const EventsPage: React.FC = () => {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            Technology: 'bg-blue-100 text-blue-800',
            Marketing: 'bg-green-100 text-green-800',
            Business: 'bg-purple-100 text-purple-800',
            Education: 'bg-orange-100 text-orange-800',
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-3xl font-bold text-gray-900">Events</h1>
                        <p className="mt-2 text-gray-600">
                            Discover and attend amazing events happening around the country
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Events List */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Upcoming Events</h2>
                        <div className="space-y-4">
                            {eventsData.map((event) => (
                                <Card key={event.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <CardTitle className="text-xl">{event.title}</CardTitle>
                                                <Badge className={getCategoryColor(event.category)}>
                                                    {event.category}
                                                </Badge>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-semibold text-blue-600">{event.price}</div>
                                            </div>
                                        </div>
                                        <CardDescription className="text-sm text-gray-600">
                                            {event.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="h-4 w-4" />
                                                <span>{formatDate(event.date)} at {event.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin className="h-4 w-4" />
                                                <span>{event.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Users className="h-4 w-4" />
                                                <span>{event.attendees} attendees</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Clock className="h-4 w-4" />
                                                <span>Organized by {event.organizer}</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t">
                                            <Button className="w-full" onClick={() => setSelectedEvent(event)}>
                                                View Details
                                                <ExternalLink className="h-4 w-4 ml-2" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Map */}
                    <div className="lg:sticky lg:top-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Locations</CardTitle>
                                <CardDescription>
                                    Hover over markers to see event details. Click markers or the &quot;View Details&quot; button for full information.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <GoogleMap
                                    events={eventsData}
                                    onEventSelect={setSelectedEvent}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl">{selectedEvent.title}</CardTitle>
                                    <Badge className={`mt-2 ${getCategoryColor(selectedEvent.category)}`}>
                                        {selectedEvent.category}
                                    </Badge>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedEvent(null)}
                                >
                                    ✕
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-500">Event Image Placeholder</span>
                                </div>

                                <p className="text-gray-700">{selectedEvent.description}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="font-medium">Date & Time</p>
                                                <p className="text-sm text-gray-600">
                                                    {formatDate(selectedEvent.date)} at {selectedEvent.time}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="font-medium">Location</p>
                                                <p className="text-sm text-gray-600">{selectedEvent.location}</p>
                                                <p className="text-sm text-gray-500">{selectedEvent.address}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="font-medium">Attendees</p>
                                                <p className="text-sm text-gray-600">{selectedEvent.attendees} people</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="font-medium">Organizer</p>
                                                <p className="text-sm text-gray-600">{selectedEvent.organizer}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {selectedEvent.price}
                                    </div>
                                    <Button size="lg">
                                        Register Now
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default EventsPage;