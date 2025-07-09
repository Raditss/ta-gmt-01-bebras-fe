"use client";

import React, { useState } from 'react';
import { Trophy, Target, Clock, Star, TrendingUp, BookOpen, Award, ChevronRight, Calendar, Zap, Play, Shuffle, Code, User, Settings, LogOut } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const achievements = [
    {
      id: 1,
      title: "First Blood",
      description: "Solved your first problem like a boss",
      icon: <Code className="w-4 h-4" />,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      earned: true
    },
    {
      id: 2,
      title: "Speed Demon",
      description: "Solved 5 problems in one day!",
      icon: <Zap className="w-4 h-4" />,
      color: "bg-gray-400",
      bgColor: "bg-gray-50",
      earned: false
    }
  ];

  const skills = [
    { name: "Algorithms", level: 3, progress: 75, total: 100, color: "bg-blue-500" },
    { name: "Data Structures", level: 2, progress: 45, total: 100, color: "bg-red-500" }
  ];

  const recentActivity = [
    {
      id: 1,
      title: "Two Sum Problem",
      time: "2 hours ago",
      difficulty: "Easy",
      status: "completed",
      color: "bg-green-500"
    },
    {
      id: 2,
      title: "Binary Search Tree",
      time: "Yesterday",
      difficulty: "Medium",
      status: "completed",
      color: "bg-blue-500"
    },
    {
      id: 3,
      title: "Dynamic Programming",
      time: "In progress",
      difficulty: "Hard",
      status: "in-progress",
      color: "bg-orange-500"
    }
  ];

  const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:bg-white/50'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with welcome message */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-pink-200 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-pink-300 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-pink-600" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Hi, Raditya Abiyu!</h1>
                  <p className="text-gray-600">Ready to tackle some coding challenges today?</p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-500">Current Streak</div>
                <div className="text-2xl font-bold text-orange-500 flex items-center gap-1">
                  15 days <span className="text-orange-400">🔥</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Level Progress Card */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
                      <div className="text-3xl font-bold">8</div>
                    </div>
                    <div className="text-sm opacity-90 mt-2">Level</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">Level 8 Progress 🚀</div>
                    <div className="text-sm opacity-90 mt-1">50/100 XP</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                    <div className="text-2xl font-bold">15</div>
                  </div>
                  <div className="text-sm opacity-90 mt-1">Days Streak</div>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-sm font-medium">This Week's Grind</div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <div
                        key={day}
                        className={`w-4 h-4 rounded-full ${
                          day <= 4 ? 'bg-white/90' : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: '50%' }}
                  />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      activity.status === 'completed' ? 'bg-green-50 border-green-500' : 'bg-orange-50 border-orange-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${activity.color}`} />
                        <div>
                          <div className="font-medium">{activity.title}</div>
                          <div className="text-sm text-gray-600">{activity.time}</div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        activity.difficulty === 'Medium' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {activity.difficulty}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ready to Solve */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Ready to Solve?</h3>
                <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <button 
                  onClick={() => window.location.href = '/problems'}
                  className="w-full bg-white text-gray-800 rounded-lg py-2 px-4 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Let's Solve
                </button>
                <button className="w-full bg-white/20 text-white rounded-lg py-2 px-4 font-medium flex items-center justify-center gap-2 hover:bg-white/30 transition-colors">
                  <Shuffle className="w-4 h-4" />
                  Random Challenge
                </button>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-500" />
                Achievement Unlocked! 🏆
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg ${achievement.bgColor} ${
                      achievement.earned ? 'opacity-100' : 'opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${achievement.color}`}>
                        {achievement.icon}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{achievement.title}</div>
                        <div className="text-xs text-gray-600">{achievement.description}</div>
                      </div>
                      {achievement.earned && (
                        <div className="ml-auto bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                          Earned
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
