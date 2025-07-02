"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Waves,
  Trash2,
  Heart,
  Star,
  Phone,
  Mail,
  User,
  QrCode,
  Download,
  Share2,
  TreePine,
  Fish,
  Sun,
} from "lucide-react"

// Indian Beach cleanup events data
const beachCleanupEvents = [
  {
    id: 1,
    title: "Mumbai Marine Drive Cleanup",
    description:
      "Join us for a morning of beach cleaning at the iconic Marine Drive. Help protect marine life and keep our Queen's Necklace pristine.",
    date: "2024-02-15",
    time: "06:00 AM",
    duration: "4 hours",
    location: "Marine Drive Beach",
    address: "Marine Drive, Nariman Point, Mumbai, Maharashtra 400021",
    lat: 18.9434,
    lng: 72.8234,
    attendees: 200,
    maxAttendees: 300,
    difficulty: "Easy",
    wasteTarget: "800 kg",
    organizer: "Mumbai Environmental Society",
    organizerContact: "+91 98765 43210",
    organizerEmail: "events@mumbaienviro.org",
    image: "/placeholder.svg?height=300&width=500",
    features: ["Free breakfast", "Equipment provided", "Volunteer certificate", "Local transport"],
    impactStats: {
      previousCleanups: 18,
      totalWasteCollected: "4.2 tons",
      volunteersHelped: 1200,
    },
    weatherForecast: "Partly cloudy, 28°C",
    meetingPoint: "Nariman Point Gateway",
    whatToBring: ["Sunscreen", "Water bottle", "Hat", "Comfortable shoes"],
    category: "Beach Cleanup",
    urgency: "High",
    marineLifeImpact: "Protects dolphins and sea turtles in Arabian Sea",
  },
  {
    id: 2,
    title: "Goa Baga Beach Conservation",
    description:
      "Experience the beauty of Goa while making a difference. This cleanup focuses on removing plastic waste and protecting the coastal ecosystem.",
    date: "2024-02-22",
    time: "07:00 AM",
    duration: "5 hours",
    location: "Baga Beach",
    address: "Baga Beach Road, Baga, Goa 403516",
    lat: 15.5557,
    lng: 73.7516,
    attendees: 120,
    maxAttendees: 180,
    difficulty: "Moderate",
    wasteTarget: "600 kg",
    organizer: "Goa Green Initiative",
    organizerContact: "+91 98234 56789",
    organizerEmail: "cleanup@goagreen.org",
    image: "/placeholder.svg?height=300&width=500",
    features: ["Local cuisine lunch", "Beach games", "Photography session", "Cultural program"],
    impactStats: {
      previousCleanups: 12,
      totalWasteCollected: "3.1 tons",
      volunteersHelped: 650,
    },
    weatherForecast: "Sunny, 32°C",
    meetingPoint: "Baga Beach Shack Area",
    whatToBring: ["Reef-safe sunscreen", "Camera", "Reusable water bottle", "Beach sandals"],
    category: "Beach Cleanup",
    urgency: "Medium",
    marineLifeImpact: "Protects coral reefs and marine biodiversity",
  },
  {
    id: 3,
    title: "Chennai Marina Beach Earth Day",
    description:
      "Celebrate Earth Day at one of India's longest beaches! Family-friendly event with educational activities for children.",
    date: "2024-04-22",
    time: "06:30 AM",
    duration: "6 hours",
    location: "Marina Beach",
    address: "Marina Beach, Chennai, Tamil Nadu 600013",
    lat: 13.0475,
    lng: 80.2824,
    attendees: 450,
    maxAttendees: 600,
    difficulty: "Easy",
    wasteTarget: "1200 kg",
    organizer: "Chennai Coastal Care",
    organizerContact: "+91 98876 54321",
    organizerEmail: "earthday@chennaicoastal.org",
    image: "/placeholder.svg?height=300&width=500",
    features: ["Kids activities", "Traditional music", "Food stalls", "Prize distribution"],
    impactStats: {
      previousCleanups: 25,
      totalWasteCollected: "6.8 tons",
      volunteersHelped: 2100,
    },
    weatherForecast: "Hot and humid, 35°C",
    meetingPoint: "Marina Beach Lighthouse",
    whatToBring: ["Family-friendly attitude", "Sunscreen", "Water", "Light cotton clothing"],
    category: "Beach Cleanup",
    urgency: "High",
    marineLifeImpact: "Protects Bay of Bengal marine ecosystem",
  },
  {
    id: 4,
    title: "Kerala Kovalam Beach Restoration",
    description:
      "Help restore the natural beauty of Kerala's famous Kovalam Beach. Focus on removing fishing nets and plastic debris from the shoreline.",
    date: "2024-03-10",
    time: "06:00 AM",
    duration: "4 hours",
    location: "Kovalam Beach",
    address: "Kovalam Beach, Thiruvananthapuram, Kerala 695527",
    lat: 8.4004,
    lng: 76.9784,
    attendees: 80,
    maxAttendees: 120,
    difficulty: "Challenging",
    wasteTarget: "400 kg",
    organizer: "Kerala Ocean Foundation",
    organizerContact: "+91 98765 12345",
    organizerEmail: "restore@keralaocean.org",
    image: "/placeholder.svg?height=300&width=500",
    features: ["Expert marine guides", "Ayurvedic refreshments", "Boat ride", "Coconut water"],
    impactStats: {
      previousCleanups: 8,
      totalWasteCollected: "1.5 tons",
      volunteersHelped: 320,
    },
    weatherForecast: "Tropical, 30°C",
    meetingPoint: "Lighthouse Beach entrance",
    whatToBring: ["Water shoes", "Gloves", "Water bottle", "Energy snacks"],
    category: "Beach Cleanup",
    urgency: "Critical",
    marineLifeImpact: "Saves trapped marine animals and protects fishing communities",
  },
  {
    id: 5,
    title: "Puducherry Paradise Beach Drive",
    description:
      "Clean up the serene Paradise Beach in Puducherry. Accessible by boat, this unique cleanup combines adventure with environmental action.",
    date: "2024-03-25",
    time: "07:30 AM",
    duration: "5 hours",
    location: "Paradise Beach",
    address: "Paradise Beach, Puducherry 605014",
    lat: 11.9416,
    lng: 79.8083,
    attendees: 60,
    maxAttendees: 100,
    difficulty: "Moderate",
    wasteTarget: "300 kg",
    organizer: "Puducherry Eco Warriors",
    organizerContact: "+91 98123 45678",
    organizerEmail: "paradise@puducherryeco.org",
    image: "/placeholder.svg?height=300&width=500",
    features: ["Boat transport", "French colonial lunch", "Snorkeling gear", "Beach volleyball"],
    impactStats: {
      previousCleanups: 6,
      totalWasteCollected: "1.2 tons",
      volunteersHelped: 280,
    },
    weatherForecast: "Pleasant, 29°C",
    meetingPoint: "Chunnambar Boat House",
    whatToBring: ["Swimming clothes", "Towel", "Waterproof bag", "Sun hat"],
    category: "Beach Cleanup",
    urgency: "Medium",
    marineLifeImpact: "Protects pristine island ecosystem and bird sanctuary",
  },
  {
    id: 6,
    title: "Odisha Puri Beach Jagannath Cleanup",
    description:
      "Sacred beach cleanup near the famous Jagannath Temple. Combine spirituality with environmental consciousness in this meaningful event.",
    date: "2024-04-05",
    time: "05:30 AM",
    duration: "4 hours",
    location: "Puri Beach",
    address: "Puri Beach, Puri, Odisha 752001",
    lat: 19.8135,
    lng: 85.8312,
    attendees: 300,
    maxAttendees: 400,
    difficulty: "Easy",
    wasteTarget: "1000 kg",
    organizer: "Odisha Coastal Mission",
    organizerContact: "+91 98654 32109",
    organizerEmail: "jagannath@odishacoastal.org",
    image: "/placeholder.svg?height=300&width=500",
    features: ["Temple prasadam", "Cultural dance", "Sand art competition", "Religious ceremony"],
    impactStats: {
      previousCleanups: 15,
      totalWasteCollected: "5.5 tons",
      volunteersHelped: 1800,
    },
    weatherForecast: "Warm and breezy, 31°C",
    meetingPoint: "Puri Beach main entrance",
    whatToBring: ["Respectful attire", "Water bottle", "Devotional spirit", "Comfortable footwear"],
    category: "Beach Cleanup",
    urgency: "High",
    marineLifeImpact: "Protects sacred waters and Olive Ridley turtle nesting sites",
  },
]

interface BeachEvent {
  id: number
  title: string
  description: string
  date: string
  time: string
  duration: string
  location: string
  address: string
  lat: number
  lng: number
  attendees: number
  maxAttendees: number
  difficulty: string
  wasteTarget: string
  organizer: string
  organizerContact: string
  organizerEmail: string
  image: string
  features: string[]
  impactStats: {
    previousCleanups: number
    totalWasteCollected: string
    volunteersHelped: number
  }
  weatherForecast: string
  meetingPoint: string
  whatToBring: string[]
  category: string
  urgency: string
  marineLifeImpact: string
}

interface RegistrationData {
  name: string
  email: string
  phone: string
  emergencyContact: string
  dietaryRestrictions: string
  experience: string
  groupSize: number
}

// Simple barcode generator component
const BarcodeGenerator: React.FC<{ data: string }> = ({ data }) => {
  const generateBarcode = (text: string) => {
    const patterns = text
      .split("")
      .map((char, index) => {
        const code = char.charCodeAt(0)
        return (code % 2 === 0 ? "█" : "▌") + (index % 3 === 0 ? "█" : "▌")
      })
      .join("")

    return patterns + "█▌█▌█"
  }

  return (
    <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
      <div className="text-center mb-2">
        <div className="font-mono text-2xl tracking-wider bg-white p-2">{generateBarcode(data)}</div>
        <div className="text-xs text-gray-600 mt-1">{data}</div>
      </div>
    </div>
  )
}

// Enhanced Google Maps Loader with proper error handling
class GoogleMapsLoader {
  private static instance: GoogleMapsLoader
  private loaded = false
  private loading = false
  private callbacks: (() => void)[] = []
  private errorCallbacks: ((error: Error) => void)[] = []

  static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader()
    }
    return GoogleMapsLoader.instance
  }

  load(apiKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loaded) {
        resolve()
        return
      }

      if (this.loading) {
        this.callbacks.push(() => resolve())
        this.errorCallbacks.push((error) => reject(error))
        return
      }

      // Check if already loaded
      if (typeof window !== "undefined" && window.google && window.google.maps) {
        this.loaded = true
        resolve()
        return
      }

      this.loading = true

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places`
      script.async = true
      script.defer = true

      script.onload = () => {
        this.loaded = true
        this.loading = false
        this.callbacks.forEach((callback) => callback())
        this.callbacks = []
        resolve()
      }

      script.onerror = () => {
        this.loading = false
        const error = new Error("Failed to load Google Maps")
        this.errorCallbacks.forEach((callback) => callback(error))
        this.errorCallbacks = []
        reject(error)
      }

      document.head.appendChild(script)
    })
  }

  isLoaded(): boolean {
    return this.loaded
  }
}

// Fallback Map Component (when Google Maps fails to load)
const FallbackMap: React.FC<{
  event?: BeachEvent
  events?: BeachEvent[]
  onEventSelect?: (event: BeachEvent) => void
  className?: string
  height?: string
}> = ({ event, events = [], onEventSelect, className = "", height = "h-64" }) => {
  const displayEvents = event ? [event] : events

  return (
    <div
      className={`relative w-full ${height} bg-gradient-to-br from-blue-200 to-cyan-300 rounded-lg overflow-hidden shadow-lg ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>

      {/* Beach Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fillRule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fillOpacity=%220.3%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="relative h-full flex flex-col justify-center items-center text-white p-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-bold mb-2">Interactive Map Preview</h3>
          <p className="text-sm opacity-90">{event ? "Event Location" : `${events.length} Beach Cleanup Locations`}</p>
        </div>

        {/* Event Markers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          {displayEvents.slice(0, 4).map((eventItem, index) => (
            <div
              key={eventItem.id}
              className="bg-white/90 backdrop-blur-sm rounded-lg p-4 cursor-pointer hover:bg-white transition-all duration-200 transform hover:scale-105"
              onClick={() => onEventSelect && onEventSelect(eventItem)}
            >
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full mt-2 animate-pulse"></div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">{eventItem.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{eventItem.location}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{eventItem.difficulty}</span>
                    <span className="text-xs text-gray-500">{eventItem.wasteTarget}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {events.length > 4 && <div className="mt-4 text-sm opacity-75">+{events.length - 4} more locations</div>}

        <div className="mt-6 text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-xs">
            <p className="font-medium mb-1">🔧 Map Setup Required</p>
            <p>Add your Google Maps API key to enable interactive maps</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced Google Maps Component with fallback
const BeachMap: React.FC<{
  event?: BeachEvent
  events?: BeachEvent[]
  onEventSelect?: (event: BeachEvent) => void
  className?: string
  height?: string
}> = ({ event, events = [], onEventSelect, className = "", height = "h-64" }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([])
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Replace with your actual Google Maps API key or use environment variable
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBEy94hZDqzOXy8U0ioRZdZ8R94R5-ip80"

  const initializeMap = useCallback(() => {
    if (!mapRef.current || typeof window === "undefined" || !window.google || !window.google.maps) return

    try {
      // Determine center and zoom based on single event or multiple events
      let center = { lat: 20.5937, lng: 78.9629 } // Default to center of India
      let zoom = 5

      if (event) {
        center = { lat: event.lat, lng: event.lng }
        zoom = 12
      } else if (events.length > 0) {
        // Calculate bounds for multiple events
        const bounds = new window.google.maps.LatLngBounds()
        events.forEach((evt) => {
          bounds.extend(new window.google.maps.LatLng(evt.lat, evt.lng))
        })
        center = bounds.getCenter().toJSON()
        zoom = 6
      }

      // Create map with India-themed styling
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: zoom,
        center: center,
        styles: [
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#4A90E2" }],
          },
          {
            featureType: "landscape.natural",
            elementType: "geometry.fill",
            stylers: [{ color: "#F5E6D3" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry.fill",
            stylers: [{ color: "#C8E6C9" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "road",
            elementType: "labels",
            stylers: [{ visibility: "simplified" }],
          },
          {
            featureType: "administrative.country",
            elementType: "geometry.stroke",
            stylers: [{ color: "#FF9933" }, { weight: 2 }],
          },
        ],
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      })

      mapInstanceRef.current = map

      // Create info window
      const infoWindow = new window.google.maps.InfoWindow({
        maxWidth: 350,
      })
      infoWindowRef.current = infoWindow

      // Add markers
      if (event) {
        addSingleMarker(map, infoWindow, event)
      } else if (events.length > 0) {
        addMultipleMarkers(map, infoWindow, events)
      }

      setIsLoaded(true)
    } catch (error) {
      console.error("Error initializing map:", error)
      setLoadError("Failed to initialize map")
    }
  }, [event, events, onEventSelect])

  const createMarkerElement = (eventData: BeachEvent, isMultiple = false) => {
    const markerElement = document.createElement("div")
    markerElement.className = "custom-marker"
    markerElement.innerHTML = `
      <div style="
        background: ${getCategoryColor(eventData.category)};
        width: ${isMultiple ? "20px" : "24px"};
        height: ${isMultiple ? "20px" : "24px"};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
        <div style="color: white; font-size: 10px; font-weight: bold;">🏖️</div>
      </div>
    `
    return markerElement
  }

  const addSingleMarker = (map: google.maps.Map, infoWindow: google.maps.InfoWindow, eventData: BeachEvent) => {
    const marker = new window.google.maps.Marker({
      position: { lat: eventData.lat, lng: eventData.lng },
      map: map,
      title: eventData.title,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: "#FF9933",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 3,
        scale: 12,
      },
    })

    const contentString = createInfoWindowContent(eventData, false)
    marker.addListener("click", () => {
      infoWindow.setContent(contentString)
      infoWindow.open(map, marker)
    })

    setTimeout(() => {
      infoWindow.setContent(contentString)
      infoWindow.open(map, marker)
    }, 500)
  }

  const addMultipleMarkers = (map: google.maps.Map, infoWindow: google.maps.InfoWindow, eventsData: BeachEvent[]) => {
    eventsData.forEach((eventData, index) => {
      const marker = new window.google.maps.Marker({
        position: { lat: eventData.lat, lng: eventData.lng },
        map: map,
        title: eventData.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: getCategoryColor(eventData.category),
          fillOpacity: 0.9,
          strokeColor: "#ffffff",
          strokeWeight: 2,
          scale: 10,
        },
      })

      const contentString = createInfoWindowContent(eventData, true)
      marker.addListener("click", () => {
        infoWindow.setContent(contentString)
        infoWindow.open(map, marker)
        if (onEventSelect) {
          onEventSelect(eventData)
        }
      })

      marker.addListener("mouseover", () => {
        infoWindow.setContent(contentString)
        infoWindow.open(map, marker)
      })
    })

    // Fit map to show all markers
    if (eventsData.length > 1) {
      const bounds = new window.google.maps.LatLngBounds()
      eventsData.forEach((evt) => {
        bounds.extend(new window.google.maps.LatLng(evt.lat, evt.lng))
      })
      map.fitBounds(bounds)

      // Ensure minimum zoom level for India
      const listener = window.google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom() && map.getZoom()! > 8) map.setZoom(8)
        window.google.maps.event.removeListener(listener)
      })
    }
  }

  const createInfoWindowContent = (eventData: BeachEvent, showViewButton = false): string => {
    return `
      <div style="max-width: 320px; padding: 16px; font-family: system-ui, -apple-system, sans-serif;">
        <div style="margin-bottom: 12px;">
          <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 18px; font-weight: 600; line-height: 1.3;">
            ${eventData.title}
          </h3>
          <div style="display: flex; gap: 8px; margin-bottom: 8px;">
            <span style="background: #FFF3CD; color: #856404; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">
              ${eventData.difficulty}
            </span>
            <span style="background: #D4EDDA; color: #155724; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">
              Target: ${eventData.wasteTarget}
            </span>
          </div>
        </div>
        
        <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px; line-height: 1.4;">
          ${eventData.description.substring(0, 120)}${eventData.description.length > 120 ? "..." : ""}
        </p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px; color: #6b7280; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 16px;">📅</span>
            <div>
              <div style="font-weight: 500; color: #374151;">${new Date(eventData.date).toLocaleDateString()}</div>
              <div>${eventData.time}</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 16px;">👥</span>
            <div>
              <div style="font-weight: 500; color: #374151;">${eventData.attendees}/${eventData.maxAttendees}</div>
              <div>participants</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 16px;">🌊</span>
            <div>
              <div style="font-weight: 500; color: #374151;">${eventData.weatherForecast}</div>
              <div>weather</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 16px;">⏱️</span>
            <div>
              <div style="font-weight: 500; color: #374151;">${eventData.duration}</div>
              <div>duration</div>
            </div>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #FFF8E1 0%, #F3E5F5 100%); padding: 12px; border-radius: 8px; margin-bottom: 16px;">
          <div style="font-size: 12px; font-weight: 600; color: #E65100; margin-bottom: 4px;">🐠 Marine Impact</div>
          <div style="font-size: 13px; color: #BF360C;">${eventData.marineLifeImpact}</div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid #e5e7eb;">
          <div style="font-size: 12px; color: #6b7280;">
            📍 ${eventData.meetingPoint}
          </div>
          ${
            showViewButton
              ? `
            <button 
              onclick="window.selectBeachEvent && window.selectBeachEvent(${eventData.id})" 
              style="background: linear-gradient(135deg, #FF9933 0%, #FF6600 100%); color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 500; box-shadow: 0 2px 4px rgba(255, 153, 51, 0.2);"
            >
              View Details
            </button>
          `
              : ""
          }
        </div>
      </div>
    `
  }

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      "Beach Cleanup": "#FF9933",
      Technology: "#3B82F6",
      Marketing: "#10B981",
      Business: "#8B5CF6",
      Education: "#F59E0B",
    }
    return colors[category] || "#6B7280"
  }

  useEffect(() => {
    const loadMap = async () => {
      // Check if API key is properly set
      if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY") {
        setLoadError("Google Maps API key not configured")
        return
      }

      try {
        const loader = GoogleMapsLoader.getInstance()
        await loader.load(GOOGLE_MAPS_API_KEY)

        // Small delay to ensure DOM is ready
        setTimeout(() => {
          initializeMap()
        }, 100)
      } catch (error) {
        console.error("Failed to load Google Maps:", error)
        setLoadError("Failed to load Google Maps. Please check your API key and internet connection.")
      }
    }

    loadMap()

    // Global function for info window button clicks
    if (onEventSelect) {
      ;(window as any).selectBeachEvent = (eventId: number) => {
        const selectedEvent = events.find((e) => e.id === eventId) || event
        if (selectedEvent && onEventSelect) {
          onEventSelect(selectedEvent)
          if (infoWindowRef.current) {
            infoWindowRef.current.close()
          }
        }
      }
    }

    // Cleanup function
    return () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.close()
      }
      markersRef.current.forEach((marker) => {
        if (marker.map) {
          marker.map = null
        }
      })
      delete (window as any).selectBeachEvent
    }
  }, [initializeMap, event, events, onEventSelect, GOOGLE_MAPS_API_KEY])

  // Show fallback map if there's an error or API key is not configured
  if (loadError) {
    return (
      <FallbackMap event={event} events={events} onEventSelect={onEventSelect} className={className} height={height} />
    )
  }

  return (
    <div className={`relative w-full ${height} bg-gray-100 rounded-lg overflow-hidden shadow-lg ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-blue-100 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🗺️</span>
              </div>
            </div>
            <p className="text-sm text-gray-700 font-medium">Loading Interactive Map...</p>
            <p className="text-xs text-gray-500 mt-2">Preparing Indian beach locations and event details</p>
          </div>
        </div>
      )}

      {/* Map Controls Overlay */}
      {isLoaded && (
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Indian Beach Cleanup Locations
          </div>
        </div>
      )}
    </div>
  )
}

// Full-screen map view component
const FullMapView: React.FC<{
  events: BeachEvent[]
  onEventSelect: (event: BeachEvent) => void
  onClose: () => void
}> = ({ events, onEventSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="h-full flex flex-col">
        {/* Map Header */}
        <div className="bg-gradient-to-r from-orange-600 to-blue-600 text-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6" />
              <div>
                <h2 className="text-xl font-bold">Beach Cleanup Locations</h2>
                <p className="text-orange-100 text-sm">{events.length} events across India</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              ✕ Close Map
            </Button>
          </div>
        </div>

        {/* Full Map */}
        <div className="flex-1">
          <BeachMap events={events} onEventSelect={onEventSelect} height="h-full" className="rounded-none" />
        </div>

        {/* Map Legend */}
        <div className="bg-white border-t p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Beach Cleanup Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <Waves className="h-4 w-4 text-blue-500" />
                  <span>Coastal Areas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fish className="h-4 w-4 text-teal-500" />
                  <span>Marine Protected Areas</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">Click markers for event details • Zoom and pan to explore</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const BeachCleanupEvents: React.FC = () => {
  const [showFullMap, setShowFullMap] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<BeachEvent | null>(null)
  const [showRegistration, setShowRegistration] = useState(false)
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    name: "",
    email: "",
    phone: "",
    emergencyContact: "",
    dietaryRestrictions: "",
    experience: "beginner",
    groupSize: 1,
  })
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [registrationId, setRegistrationId] = useState("")

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Easy: "bg-green-100 text-green-800 border-green-200",
      Moderate: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Challenging: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      High: "bg-red-500",
      Medium: "bg-yellow-500",
      Critical: "bg-red-600 animate-pulse",
    }
    return colors[urgency as keyof typeof colors] || "bg-gray-500"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleRegistration = (event: BeachEvent) => {
    setSelectedEvent(event)
    setShowRegistration(true)
    setRegistrationComplete(false)
  }

  const submitRegistration = () => {
    // Generate registration ID
    const regId = `BCU${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`
    setRegistrationId(regId)
    setRegistrationComplete(true)
    setShowRegistration(false)
  }

  const downloadRegistration = () => {
    // Create a simple text file with registration details
    const content = `
Beach Cleanup Registration Confirmation
=====================================

Event: ${selectedEvent?.title}
Date: ${selectedEvent ? formatDate(selectedEvent.date) : ""}
Time: ${selectedEvent?.time}
Location: ${selectedEvent?.location}

Participant: ${registrationData.name}
Email: ${registrationData.email}
Phone: ${registrationData.phone}
Registration ID: ${registrationId}

Please bring this confirmation to the event.
    `.trim()

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `beach-cleanup-registration-${registrationId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-green-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fillRule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fillOpacity=%220.1%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Waves className="h-12 w-12" />
              <h1 className="text-5xl font-bold">Indian Beach Cleanup Events</h1>
              <Waves className="h-12 w-12" />
            </div>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
              Join our community of ocean heroes across India! Protect marine life, preserve our beautiful coastlines,
              and make a lasting impact on our nation's environmental future.
            </p>
            <div className="flex justify-center gap-8 mt-8 text-sm">
              <div className="flex items-center gap-2">
                <TreePine className="h-5 w-5" />
                <span>Eco-Friendly</span>
              </div>
              <div className="flex items-center gap-2">
                <Fish className="h-5 w-5" />
                <span>Marine Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <span>Community Impact</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-full">
                <Trash2 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">18.5 tons</div>
                <div className="text-sm text-gray-600">Waste Collected</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">4,350</div>
                <div className="text-sm text-gray-600">Volunteers</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Fish className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">1,200+</div>
                <div className="text-sm text-gray-600">Marine Animals Saved</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-full">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">84</div>
                <div className="text-sm text-gray-600">Cleanup Events</div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Overview Section */}
        <div className="mb-12">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <MapPin className="h-5 w-5 text-orange-600" />
                    Event Locations Overview
                  </CardTitle>
                  <CardDescription>Explore all beach cleanup locations across India</CardDescription>
                </div>
                <Button
                  onClick={() => setShowFullMap(true)}
                  className="bg-gradient-to-r from-orange-600 to-blue-600 hover:from-orange-700 hover:to-blue-700"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  View Full Map
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <BeachMap events={beachCleanupEvents} onEventSelect={setSelectedEvent} height="h-80" />
            </CardContent>
          </Card>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {beachCleanupEvents.map((event) => (
            <Card
              key={event.id}
              className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden bg-white"
            >
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-6xl mb-2">🏖️</div>
                    <div className="text-sm opacity-90">Beach Cleanup Event</div>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <div className={`w-3 h-3 rounded-full ${getUrgencyColor(event.urgency)}`}></div>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className={getDifficultyColor(event.difficulty)}>{event.difficulty}</Badge>
                </div>
              </div>

              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-xl group-hover:text-orange-600 transition-colors">
                      {event.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-orange-50 text-orange-700">
                        Target: {event.wasteTarget}
                      </Badge>
                      <Badge variant="secondary" className="bg-green-50 text-green-700">
                        {event.attendees}/{event.maxAttendees} joined
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-gray-600 leading-relaxed">{event.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span>
                      {event.time} ({event.duration})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Sun className="h-4 w-4 text-yellow-500" />
                    <span>{event.weatherForecast}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Impact Preview:</div>
                  <div className="text-sm text-gray-600">{event.marineLifeImpact}</div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-orange-600 to-blue-600 hover:from-orange-700 hover:to-blue-700"
                    onClick={() => setSelectedEvent(event)}
                  >
                    View Details
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                    onClick={() => handleRegistration(event)}
                  >
                    Register Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && !showRegistration && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white">
            <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-blue-50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-gray-900">{selectedEvent.title}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getDifficultyColor(selectedEvent.difficulty)}>{selectedEvent.difficulty}</Badge>
                    <Badge className="bg-orange-100 text-orange-800">{selectedEvent.category}</Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Event Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Date & Time</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(selectedEvent.date)} at {selectedEvent.time}
                          </p>
                          <p className="text-sm text-gray-500">Duration: {selectedEvent.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-sm text-gray-600">{selectedEvent.location}</p>
                          <p className="text-sm text-gray-500">{selectedEvent.address}</p>
                          <p className="text-sm text-gray-500">Meeting point: {selectedEvent.meetingPoint}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Participants</p>
                          <p className="text-sm text-gray-600">
                            {selectedEvent.attendees} registered / {selectedEvent.maxAttendees} max
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">What to Bring</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedEvent.whatToBring.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Event Features</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedEvent.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Location Map</h3>
                    <BeachMap event={selectedEvent} />
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-orange-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Environmental Impact</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Waste Target:</span>
                        <span className="font-medium text-green-600">{selectedEvent.wasteTarget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Marine Life Impact:</span>
                        <span className="font-medium text-blue-600">{selectedEvent.marineLifeImpact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Previous Cleanups:</span>
                        <span className="font-medium">{selectedEvent.impactStats.previousCleanups}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Waste Collected:</span>
                        <span className="font-medium">{selectedEvent.impactStats.totalWasteCollected}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Organizer Contact</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>{selectedEvent.organizer}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{selectedEvent.organizerContact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{selectedEvent.organizerEmail}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                  onClick={() => handleRegistration(selectedEvent)}
                >
                  Register for This Event
                </Button>
                <Button variant="outline" size="lg" className="flex items-center gap-2 bg-transparent">
                  <Share2 className="w-4 h-4" />
                  Share Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Registration Modal */}
      {showRegistration && selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">Register for Beach Cleanup</CardTitle>
                  <CardDescription className="mt-1">
                    {selectedEvent.title} - {formatDate(selectedEvent.date)}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowRegistration(false)}>
                  ✕
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={registrationData.name}
                      onChange={(e) => setRegistrationData({ ...registrationData, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={registrationData.email}
                      onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={registrationData.phone}
                      onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergency">Emergency Contact</Label>
                    <Input
                      id="emergency"
                      value={registrationData.emergencyContact}
                      onChange={(e) => setRegistrationData({ ...registrationData, emergencyContact: e.target.value })}
                      placeholder="Emergency contact number"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dietary">Dietary Restrictions / Allergies</Label>
                  <Textarea
                    id="dietary"
                    value={registrationData.dietaryRestrictions}
                    onChange={(e) => setRegistrationData({ ...registrationData, dietaryRestrictions: e.target.value })}
                    placeholder="Please list any dietary restrictions or allergies..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experience">Experience Level</Label>
                    <select
                      id="experience"
                      value={registrationData.experience}
                      onChange={(e) => setRegistrationData({ ...registrationData, experience: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="beginner">First time volunteer</option>
                      <option value="some">Some experience</option>
                      <option value="experienced">Very experienced</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="groupSize">Group Size</Label>
                    <Input
                      id="groupSize"
                      type="number"
                      min="1"
                      max="10"
                      value={registrationData.groupSize}
                      onChange={(e) =>
                        setRegistrationData({ ...registrationData, groupSize: Number.parseInt(e.target.value) || 1 })
                      }
                    />
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-medium text-orange-900 mb-2">Event Reminder</h4>
                  <div className="text-sm text-orange-800 space-y-1">
                    <p>• Arrive 15 minutes early at: {selectedEvent.meetingPoint}</p>
                    <p>• Weather forecast: {selectedEvent.weatherForecast}</p>
                    <p>• Bring: {selectedEvent.whatToBring.join(", ")}</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={submitRegistration}
                    className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                    disabled={!registrationData.name || !registrationData.email || !registrationData.phone}
                  >
                    Complete Registration
                  </Button>
                  <Button variant="outline" onClick={() => setShowRegistration(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Registration Success Modal */}
      {registrationComplete && selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center bg-gradient-to-r from-green-50 to-teal-50">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <QrCode className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-800">Registration Successful!</CardTitle>
              <CardDescription>You're all set for {selectedEvent.title}</CardDescription>
            </CardHeader>

            <CardContent className="p-6 text-center space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">Registration ID</div>
                <div className="text-2xl font-bold text-gray-900">{registrationId}</div>
              </div>

              <BarcodeGenerator data={registrationId} />

              <div className="text-sm text-gray-600 space-y-1">
                <p>• Save this barcode to your phone</p>
                <p>• Present it at the event check-in</p>
                <p>• Confirmation email sent to {registrationData.email}</p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={downloadRegistration}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-blue-600 hover:from-orange-700 hover:to-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Confirmation
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setRegistrationComplete(false)
                    setSelectedEvent(null)
                  }}
                >
                  Done
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Full Map View */}
      {showFullMap && (
        <FullMapView
          events={beachCleanupEvents}
          onEventSelect={(event) => {
            setSelectedEvent(event)
            setShowFullMap(false)
          }}
          onClose={() => setShowFullMap(false)}
        />
      )}
    </div>
  )
}

export default BeachCleanupEvents
