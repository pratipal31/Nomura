"use client";
import React, { useState } from 'react';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('overall');

  // Sample leaderboard data
  const leaderboardData = [
    {
      id: 1,
      name: 'Priya Sharma',
      avatar: '👩‍🦱',
      rank: 1,
      drives: 24,
      points: 2400,
      badges: ['🏆', '🌟', '🔥', '💎', '🌊'],
      city: 'Chennai',
      level: 'Ocean Guardian'
    },
    {
      id: 2,
      name: 'Arjun Patel',
      avatar: '👨‍💼',
      rank: 2,
      drives: 22,
      points: 2200,
      badges: ['🥈', '🌟', '🔥', '🌊'],
      city: 'Mumbai',
      level: 'Wave Protector'
    },
    {
      id: 3,
      name: 'Kavya Menon',
      avatar: '👩‍🎓',
      rank: 3,
      drives: 20,
      points: 2000,
      badges: ['🥉', '🌟', '🔥'],
      city: 'Kochi',
      level: 'Coast Defender'
    },
    {
      id: 4,
      name: 'Rohit Kumar',
      avatar: '👨‍🔬',
      rank: 4,
      drives: 18,
      points: 1800,
      badges: ['🌟', '🔥'],
      city: 'Goa',
      level: 'Beach Hero'
    },
    {
      id: 5,
      name: 'Ananya Singh',
      avatar: '👩‍💻',
      rank: 5,
      drives: 16,
      points: 1600,
      badges: ['🌟'],
      city: 'Visakhapatnam',
      level: 'Sand Guardian'
    },
    {
      id: 6,
      name: 'You',
      avatar: '👤',
      rank: 8,
      drives: 12,
      points: 1200,
      badges: ['🌟'],
      city: 'Chennai',
      level: 'Cleanup Rookie',
      isCurrentUser: true
    }
  ];

  const badges = [
    { icon: '🏆', name: 'Champion', description: '25+ beach drives' },
    { icon: '🥈', name: 'Runner-up', description: 'Top 3 monthly' },
    { icon: '🥉', name: 'Achiever', description: 'Top 5 monthly' },
    { icon: '🌟', name: 'Star Volunteer', description: '10+ drives' },
    { icon: '🔥', name: 'On Fire', description: '5 drives in a month' },
    { icon: '💎', name: 'Diamond Member', description: '50+ drives lifetime' },
    { icon: '🌊', name: 'Ocean Lover', description: 'Coastal cleanup specialist' },
    { icon: '🌱', name: 'Eco Warrior', description: 'Environmental impact award' }
  ];

  const getRankSuffix = (rank) => {
    if (rank === 1) return 'st';
    if (rank === 2) return 'nd';
    if (rank === 3) return 'rd';
    return 'th';
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-slate-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2">Volunteer Leaderboard</h1>
          <p className="text-center text-slate-300">Track your impact and celebrate our community heroes</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Current User Stats Card */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl p-6 mb-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">👤</div>
              <div>
                <h2 className="text-2xl font-bold">Your Rank: 8th</h2>
                <p className="text-teal-100">Cleanup Rookie Level</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">1,200</div>
              <div className="text-teal-100">Points</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">12</div>
              <div className="text-teal-100 text-sm">Beach Drives</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">1</div>
              <div className="text-teal-100 text-sm">Badges Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">Chennai</div>
              <div className="text-teal-100 text-sm">Active City</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-xl p-1 mb-8 shadow-lg">
          {['overall', 'monthly', 'city'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium capitalize transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {tab} Rankings
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-6">
                <h3 className="text-2xl font-bold text-white">Top Volunteers</h3>
              </div>
              
              <div className="p-6">
                {/* Top 3 Podium */}
                <div className="flex justify-center items-end mb-8 space-x-4">
                  {leaderboardData.slice(0, 3).map((user, index) => (
                    <div
                      key={user.id}
                      className={`text-center ${
                        index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'
                      }`}
                    >
                      <div className="relative">
                        <div className="text-6xl mb-2">{user.avatar}</div>
                        <div className={`absolute -top-2 -right-2 text-2xl ${getRankColor(user.rank)}`}>
                          {user.rank === 1 ? '👑' : user.rank === 2 ? '🥈' : '🥉'}
                        </div>
                      </div>
                      <div className="font-bold text-slate-800">{user.name}</div>
                      <div className="text-sm text-slate-600">{user.points} pts</div>
                      <div className={`h-16 ${
                        index === 0 ? 'bg-gradient-to-t from-yellow-400 to-yellow-300 h-20' :
                        index === 1 ? 'bg-gradient-to-t from-slate-400 to-slate-300' :
                        'bg-gradient-to-t from-amber-600 to-amber-500'
                      } rounded-t-lg mt-2 flex items-end justify-center pb-2`}>
                        <span className="text-white font-bold">#{user.rank}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Full Leaderboard List */}
                <div className="space-y-3">
                  {leaderboardData.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                        user.isCurrentUser
                          ? 'bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-200 shadow-md'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`text-2xl font-bold w-8 text-center ${getRankColor(user.rank)}`}>
                          #{user.rank}
                        </div>
                        <div className="text-3xl">{user.avatar}</div>
                        <div>
                          <div className="font-semibold text-slate-800 flex items-center">
                            {user.name}
                            {user.isCurrentUser && (
                              <span className="ml-2 bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-600">{user.level} • {user.city}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-800">{user.points} pts</div>
                        <div className="text-sm text-slate-600">{user.drives} drives</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Badges & Achievements */}
          <div className="space-y-6">
            {/* Your Badges */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Your Badges</h3>
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="text-center p-3 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                  <div className="text-3xl mb-1">🌟</div>
                  <div className="text-xs font-medium text-yellow-800">Star Volunteer</div>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded-lg border border-gray-200 opacity-50">
                  <div className="text-3xl mb-1">🔥</div>
                  <div className="text-xs text-gray-500">Locked</div>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded-lg border border-gray-200 opacity-50">
                  <div className="text-3xl mb-1">🌊</div>
                  <div className="text-xs text-gray-500">Locked</div>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded-lg border border-gray-200 opacity-50">
                  <div className="text-3xl mb-1">🏆</div>
                  <div className="text-xs text-gray-500">Locked</div>
                </div>
              </div>
              <div className="text-center">
                <button className="text-teal-600 hover:text-teal-800 font-medium text-sm">
                  View All Badges →
                </button>
              </div>
            </div>

            {/* Next Goal */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Next Goal</h3>
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-3xl">🔥</div>
                <div>
                  <div className="font-semibold">On Fire Badge</div>
                  <div className="text-purple-100 text-sm">5 drives in a month</div>
                </div>
              </div>
              <div className="bg-white/20 rounded-full h-2 mb-2">
                <div className="bg-white rounded-full h-2 w-3/5"></div>
              </div>
              <div className="text-purple-100 text-sm">3 of 5 drives completed this month</div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">This Month</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Drives Attended</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Points Earned</span>
                  <span className="font-semibold">300</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Rank Change</span>
                  <span className="font-semibold text-green-600">↑ 2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Cities Visited</span>
                  <span className="font-semibold">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;