'use client';

import React from 'react';
import { Trophy, TrendingUp, BookOpen, Award, Play, User } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useDashboard } from '@/hooks/useDashboard';

const Dashboard = () => {
  const { user } = useAuthStore();

  // Use the dashboard hook to get all data
  const {
    level,
    trophyCurrent,
    trophyTotal,
    points,
    totalPoints,
    progressPercent,
    streakDays,
    weeklyGrind,
    achievements,
    recentActivity,
    isLoading,
    error
  } = useDashboard();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state with fallback data
  if (error) {
    console.warn('Dashboard error (using fallback data):', error);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Left Side - Illustrations */}
            <div className="flex items-center gap-6">
              {/* Book with lightbulb illustration */}
              <div className="relative">
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-blue-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Woman illustration placeholder */}
              <div className="w-20 h-20 bg-pink-200 rounded-2xl flex items-center justify-center">
                <User className="w-10 h-10 text-pink-600" />
              </div>
            </div>

            {/* Center - Main Text */}
            <div className="text-center flex-1 mx-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Hi, {user?.name}!
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Kata-kata hari ini kali yak, atau kaya kalimat penyemangat atau
                apa gitu dit lu pikir dah
              </p>
            </div>

            {/* Right Side - Illustrations */}
            <div className="flex items-center gap-6">
              {/* Man illustration placeholder */}
              <div className="w-20 h-20 bg-blue-200 rounded-2xl flex items-center justify-center">
                <User className="w-10 h-10 text-blue-600" />
              </div>

              {/* Rocket illustration */}
              <div className="w-20 h-20 bg-red-200 rounded-2xl flex items-center justify-center">
                <div className="w-10 h-10 bg-red-400 rounded-full flex items-center justify-center transform rotate-45">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Title */}
        <div className="px-2">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Level Progress Card - Takes up 3 columns */}
          <div className="lg:col-span-3">
            <div className="relative h-64 bg-gradient-to-br from-pink-400 via-pink-300 to-pink-400 rounded-3xl p-8 flex items-center border-2 shadow-lg overflow-hidden">
              {/* Level Circle + Trophy */}
              <div className="relative flex-shrink-0" style={{ width: 180 }}>
                <div className="w-40 h-40 bg-teal-400 rounded-full flex flex-col items-center justify-center border-8 border-white mx-auto">
                  <div className="text-7xl font-bold text-white leading-none">
                    {level}
                  </div>
                  <div className="text-2xl text-white font-medium mt-1">
                    Level
                  </div>
                </div>
                {/* Trophy badge */}
                <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 w-28 h-12 bg-yellow-300 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <Trophy className="w-6 h-6 text-black mr-2" />
                  <span className="text-lg font-bold text-black">
                    {trophyCurrent}/{trophyTotal}
                  </span>
                </div>
              </div>
              {/* Progress and Streak */}
              <div className="flex-1 flex flex-col justify-center pl-12 h-full">
                <div className="flex items-center mb-2">
                  <span className="text-xl font-bold text-white mr-2">
                    Your Progress
                  </span>
                  <span className="text-xl">🚀</span>
                </div>
                {/* Progress Bar */}
                <div className="relative w-full h-6 mb-6">
                  <div className="absolute top-0 left-0 w-full h-6 bg-pink-200 rounded-full" />
                  <div
                    className="absolute top-0 left-0 h-6 bg-gradient-to-r from-cyan-300 to-teal-400 rounded-full"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                  {/* XP badge at top right */}
                  <div className="absolute -top-7 right-0 bg-pink-300 rounded-full px-5 py-1 text-base font-bold text-white shadow">
                    {points}/{totalPoints} Points
                  </div>
                </div>
                {/* Streak and Weekly Grind */}
                <div className="flex items-center gap-6">
                  {/* Streak Card */}
                  <div className="bg-white rounded-2xl px-6 py-3 flex items-center gap-4 shadow">
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C12 2 7 7.5 7 12C7 15.3137 9.68629 18 13 18C16.3137 18 19 15.3137 19 12C19 7.5 12 2 12 2Z"
                        fill="#FFD600"
                      />
                      <circle cx="12" cy="15" r="3" fill="#FFD600" />
                    </svg>
                    <div className="flex flex-col items-start">
                      <span className="text-3xl font-bold text-black leading-none">
                        {streakDays}
                      </span>
                      <span className="text-base text-black">Days</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-medium text-white">
                        This Week&apos;s Grind
                      </span>
                    </div>
                    <div className="flex gap-2 mt-1">
                      {weeklyGrind.map((isCompleted, idx) => (
                        <div
                          key={idx}
                          className={`w-7 h-7 rounded-full ${isCompleted ? 'bg-yellow-300' : 'bg-pink-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ready to Solve Card - Takes up 1 column */}
          <div className="lg:col-span-1">
            <div className="h-64 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-3xl p-8 text-black flex flex-col justify-center items-center shadow-lg">
              <h3 className="font-bold text-2xl mb-8">Ready to Solve?</h3>
              <div className="space-y-4 w-full">
                <button
                  onClick={() => (window.location.href = '/problems')}
                  className="w-full bg-white text-black rounded-full py-4 px-6 font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors text-lg shadow"
                >
                  <Play className="w-5 h-5" />
                  Let&apos;s Solve
                </button>
                <button className="w-full bg-white text-black rounded-full py-4 px-6 font-bold flex items-center justify-center gap-3 border border-black/10 hover:bg-gray-50 transition-colors text-lg shadow">
                  <span className="inline-block">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4h16v16H4V4zm4 4h8v8H8V8z"
                      />
                    </svg>
                  </span>
                  Random Challenge
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-purple-500" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className={`p-4 rounded-2xl border-l-4 ${
                      activity.status === 'completed'
                        ? 'bg-green-50 border-green-500'
                        : 'bg-orange-50 border-orange-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-3 h-3 rounded-full ${activity.color}`}
                        />
                        <div>
                          <div className="font-semibold text-lg">
                            {activity.title}
                          </div>
                          <div className="text-gray-600">{activity.time}</div>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          activity.difficulty === 'Easy'
                            ? 'bg-green-100 text-green-700'
                            : activity.difficulty === 'Medium'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {activity.difficulty}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Award className="w-6 h-6 text-purple-500" />
                Achievements 🏆
              </h3>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-2xl ${achievement.bgColor} ${
                      achievement.earned ? 'opacity-100' : 'opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${achievement.color}`}
                      >
                        <achievement.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{achievement.title}</div>
                        <div className="text-sm text-gray-600">
                          {achievement.description}
                        </div>
                      </div>
                      {achievement.earned && (
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
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
