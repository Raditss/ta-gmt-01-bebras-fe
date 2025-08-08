'use client';

import React, { useState } from 'react';
import { TrendingUp, Play, Target } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useDashboard } from '@/hooks/useDashboard';
import Image from 'next/image';
import RandomQuote from '@/components/ui/random-quotes';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { QuestionTypeModal } from '@/components/features/questions/question-type-modal';
import { QuestionTypeEnum } from '@/types/question-type.type';
import { questionsApi } from '@/lib/api/questions.api';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  // Use the dashboard hook to get all data
  const {
    // level,
    // trophyCurrent,
    // trophyTotal,
    points,
    totalPoints,
    progressPercent,
    streakDays,
    weeklyGrind,
    // achievements,
    recentActivity,
    isLoading,
    error,
    questionStatistics
  } = useDashboard();

  const handleGenerateQuestion = async (type: QuestionTypeEnum) => {
    console.log('handleGenerateQuestion called with type:', type);

    try {
      setIsTypeModalOpen(false);

      // Show loading state while generating
      console.log('Generating question for type:', type);

      // Call backend to generate the question
      console.log('Calling questionsApi.generateQuestion...');
      const generatedQuestion = await questionsApi.generateQuestion(type);
      console.log('Generated question received:', generatedQuestion);

      // Store the generated question in sessionStorage for the solve page
      sessionStorage.setItem(
        'generatedQuestion',
        JSON.stringify(generatedQuestion)
      );
      console.log('Question stored in sessionStorage');

      // Navigate to the generated question solver
      const targetUrl = `/problems/generated/${type}/solve`;
      console.log('Navigating to:', targetUrl);
      router.push(targetUrl);
    } catch (error) {
      console.error('Failed to generate question:', error);
      console.error('Error details:', error);
      // Reopen modal on error
      setIsTypeModalOpen(true);
      // You could show an error toast here
      alert(
        `Gagal membuat soal: ${error instanceof Error ? error.message : 'Kesalahan tidak diketahui'}`
      );
    }
  };

  const handleOpenGenerateModal = () => {
    setIsTypeModalOpen(true);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
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
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl relative overflow-visible min-h-[120px] flex items-center">
          {/* Left Illustration */}
          <div className="absolute left-4 bottom-0">
            <Image
              src="/graphic/woman-dash.svg"
              alt="woman"
              width={280}
              height={280}
              className="object-contain object-bottom"
              style={{ zIndex: 10 }}
            />
          </div>

          {/* Right Illustration */}
          <div className="absolute right-4 bottom-0">
            <Image
              src="/graphic/man-dash.svg"
              alt="man"
              width={280}
              height={280}
              className="object-contain object-bottom"
              style={{ zIndex: 10 }}
            />
          </div>

          {/* Center Text */}
          <div className="text-center flex-1 mx-8 z-20 relative px-32">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Hi, {user?.name}!
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              <RandomQuote />
            </p>
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
                <div className="w-40 h-40 bg-teal-400 rounded-full flex flex-col items-center justify-center border-8 border-white mx-auto relative">
                  <Avatar className="w-32 h-32 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg border-4 border-white">
                    <AvatarImage
                      src={user?.photoUrl || '/placeholder-user.jpg'}
                      alt={user?.username || 'Avatar'}
                    />
                    <AvatarFallback className="text-3xl">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {/* Trophy badge */}
              </div>
              {/* Progress and Streak */}
              <div className="flex-1 flex flex-col justify-center pl-12 h-full">
                <div className="flex items-center mb-2">
                  <span className="text-xl font-bold text-white mr-2">
                    Poin Kamu
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
                    {points}/{totalPoints} Poin
                  </div>
                </div>
                {/* Streak and Weekly Grind */}
                <div className="flex items-center gap-6">
                  {/* Streak Card */}
                  <div className="bg-white rounded-2xl px-6 py-3 flex items-center gap-4 shadow">
                    <Image
                      src="/graphic/streak-on.svg"
                      alt="streak"
                      width={36}
                      height={36}
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-3xl font-bold text-black leading-none">
                        {streakDays}
                      </span>
                      <span className="text-base text-black">Hari</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-medium text-white">
                        Kegiatanmu Seminggu Terakhir
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
              <h3 className="font-semibold text-lg mb-8">Siap Mengerjakan?</h3>
              <div className="space-y-4 w-full">
                <button
                  onClick={() => (window.location.href = '/problems')}
                  className="w-full bg-white text-black rounded-full py-3 px-6 font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors text-base shadow"
                >
                  <Play className="w-4 h-4" />
                  Kerjakan Soal
                </button>
                <button
                  onClick={handleOpenGenerateModal}
                  className="w-full bg-white text-black rounded-full py-3 px-6 font-semibold flex items-center justify-center gap-3 border border-black/10 hover:bg-gray-50 transition-colors text-base shadow"
                >
                  <span className="inline-block">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
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
                  Soal Acak
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
                Kegiatan Terbaru
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

          {/* Progress Tracking */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-purple-500" />
                Progress Tracking
              </h3>
              <div className="space-y-6">
                {questionStatistics.map((stat) => (
                  <div key={stat.questionTypeId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <span className="font-semibold text-sm capitalize">
                          {stat.questionTypeName.replace('-', ' ')}
                        </span>
                      </div>
                      <span className="text-xs text-gray-600">
                        {stat.completedQuestions}/{stat.totalQuestions}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(stat.completedQuestions / stat.totalQuestions) * 100}%`
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round(
                        (stat.completedQuestions / stat.totalQuestions) * 100
                      )}
                      % Complete
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Type Modal */}
      <QuestionTypeModal
        open={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        onSelectType={handleGenerateQuestion}
      />
    </div>
  );
};

export default Dashboard;
