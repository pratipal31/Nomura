"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Calendar, Trash2, Leaf, Trophy, MapPin, Mail, Award, TrendingUp, Clock, Users } from "lucide-react"

const Dashboard = () => {
  // Mock user data - this would come from your API/database
  const [userData] = useState({
    personalInfo: {
      name: "Alex Johnson",
      email: "alex.johnson@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      joinDate: "January 2023",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    stats: {
      wasteCollected: 245.5, // kg
      carbonReduced: 78.2, // percentage
      eventsAttended: 12,
      totalPoints: 1250,
    },
    upcomingEvents: [
      {
        id: 1,
        title: "Beach Cleanup Drive",
        date: "2024-01-15",
        time: "09:00 AM",
        location: "Ocean Beach",
        participants: 45,
      },
      {
        id: 2,
        title: "Recycling Workshop",
        date: "2024-01-20",
        time: "02:00 PM",
        location: "Community Center",
        participants: 25,
      },
      {
        id: 3,
        title: "Tree Planting Event",
        date: "2024-01-25",
        time: "10:00 AM",
        location: "Golden Gate Park",
        participants: 60,
      },
    ],
    badges: [
      { id: 1, name: "Eco Warrior", description: "Collected 100kg+ waste", icon: "🌟", earned: true },
      { id: 2, name: "Carbon Crusher", description: "Reduced 50%+ carbon footprint", icon: "🌱", earned: true },
      { id: 3, name: "Event Champion", description: "Attended 10+ events", icon: "🏆", earned: true },
      { id: 4, name: "Community Leader", description: "Organized 5+ events", icon: "👑", earned: false },
      { id: 5, name: "Green Guardian", description: "1 year of consistent participation", icon: "🛡️", earned: true },
      { id: 6, name: "Waste Wizard", description: "Collected 500kg+ waste", icon: "⚡", earned: false },
    ],
    recentActivity: [
      { date: "2024-01-10", activity: "Collected 15kg plastic waste", points: 75 },
      { date: "2024-01-08", activity: "Attended Recycling Workshop", points: 50 },
      { date: "2024-01-05", activity: "Organized neighborhood cleanup", points: 100 },
      { date: "2024-01-03", activity: "Collected 8kg organic waste", points: 40 },
    ],
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-green-200">
              <AvatarImage src={userData.personalInfo.avatar || "/placeholder.svg"} alt={userData.personalInfo.name} />
              <AvatarFallback className="bg-green-100 text-green-700 text-xl font-bold">
                {userData.personalInfo.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">{userData.personalInfo.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {userData.personalInfo.email}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {userData.personalInfo.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Member since {userData.personalInfo.joinDate}
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userData.stats.totalPoints}</div>
              <div className="text-sm text-gray-500">Total Points</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trash2 className="h-5 w-5" />
                Waste Collected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userData.stats.wasteCollected} kg</div>
              <p className="text-green-100 text-sm mt-1">Keep up the great work!</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Leaf className="h-5 w-5" />
                Carbon Reduced
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userData.stats.carbonReduced}%</div>
              <p className="text-blue-100 text-sm mt-1">Amazing impact!</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                Events Attended
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userData.stats.eventsAttended}</div>
              <p className="text-purple-100 text-sm mt-1">Community champion!</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5" />
                Badges Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {userData.badges.filter((badge) => badge.earned).length}/{userData.badges.length}
              </div>
              <p className="text-orange-100 text-sm mt-1">Unlock more badges!</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progress Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Monthly Progress
                  </CardTitle>
                  <CardDescription>Your environmental impact this month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Waste Collection Goal</span>
                      <span>{userData.stats.wasteCollected}/300 kg</span>
                    </div>
                    <Progress value={(userData.stats.wasteCollected / 300) * 100} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Carbon Reduction Goal</span>
                      <span>{userData.stats.carbonReduced}/100%</span>
                    </div>
                    <Progress value={userData.stats.carbonReduced} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Event Participation</span>
                      <span>{userData.stats.eventsAttended}/15 events</span>
                    </div>
                    <Progress value={(userData.stats.eventsAttended / 15) * 100} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{activity.activity}</p>
                          <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          +{activity.points} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Upcoming Events
                </CardTitle>
                <CardDescription>Events you're registered for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.upcomingEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(event.date)} at {event.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {event.participants} participants
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Achievement Badges
                </CardTitle>
                <CardDescription>Your environmental achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userData.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        badge.earned
                          ? "border-green-200 bg-green-50 shadow-md"
                          : "border-gray-200 bg-gray-50 opacity-60"
                      }`}
                    >
                      <div className="text-center space-y-2">
                        <div className="text-4xl">{badge.icon}</div>
                        <h3 className={`font-semibold ${badge.earned ? "text-green-700" : "text-gray-500"}`}>
                          {badge.name}
                        </h3>
                        <p className={`text-sm ${badge.earned ? "text-green-600" : "text-gray-400"}`}>
                          {badge.description}
                        </p>
                        {badge.earned && (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Earned</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <p className="mt-1 text-gray-900">{userData.personalInfo.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <p className="mt-1 text-gray-900">{userData.personalInfo.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                      <p className="mt-1 text-gray-900">{userData.personalInfo.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <p className="mt-1 text-gray-900">{userData.personalInfo.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Member Since</label>
                      <p className="mt-1 text-gray-900">{userData.personalInfo.joinDate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Total Points</label>
                      <p className="mt-1 text-gray-900 font-semibold text-green-600">
                        {userData.stats.totalPoints} points
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t">
                  <Button className="bg-green-600 hover:bg-green-700">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Dashboard
