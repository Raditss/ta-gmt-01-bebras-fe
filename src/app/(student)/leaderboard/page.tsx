'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Award, TrendingUp, Target } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { TimeFrame, LeaderboardItem } from '@/types/leaderboard.type';

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Award className="w-6 h-6 text-amber-600" />;
    default:
      return (
        <div className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">
          #{rank}
        </div>
      );
  }
};

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('all-time');

  // Map activeTab to TimeFrame enum
  const getTimeFrame = (tab: string): TimeFrame => {
    switch (tab) {
      case 'monthly':
        return TimeFrame.LAST_MONTH;
      case 'weekly':
        return TimeFrame.LAST_WEEK;
      case 'all-time':
      default:
        return TimeFrame.ALL_TIME;
    }
  };

  const { topTen, currentUser, totalPlayers, isLoading, error } =
    useLeaderboard(getTimeFrame(activeTab));

  const topThree = topTen.slice(0, 3);
  const remainingUsers = topTen.slice(3);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    console.warn('Leaderboard error (using fallback data):', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Leaderboard</h1>
          <p className="text-gray-600">
            See how you rank against other computational thinkers in the
            community.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  {totalPlayers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Players</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  # {currentUser?.order || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Your Rank</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  {currentUser?.points?.toLocaleString() || '0'}
                </div>
                <div className="text-sm text-gray-600">Your Points</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Leaderboard */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Peringkat Global
                </CardTitle>
                <CardDescription>
                  Peringkat berdasarkan total poin yang diperoleh dari
                  menyelesaikan soal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all-time">Semua Waktu</TabsTrigger>
                    <TabsTrigger value="monthly">Bulan Ini</TabsTrigger>
                    <TabsTrigger value="weekly">Minggu Ini</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all-time" className="mt-6">
                    {/* Podium Section */}
                    <div className="mb-8">
                      <div className="flex items-end justify-center gap-4 mb-8">
                        {/* Second Place */}
                        <div className="flex flex-col items-center">
                          <Avatar className="w-16 h-16 mb-3 ring-4 ring-blue-400">
                            {topThree[1]?.user.photoUrl ? (
                              <AvatarImage
                                src={topThree[1]?.user.photoUrl}
                                alt={topThree[1]?.user.name}
                              />
                            ) : (
                              <AvatarFallback className="text-lg font-bold bg-blue-500 text-white">
                                {topThree[1]?.user.name.charAt(0)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                            {topThree[1]?.points} Points
                          </div>
                          <div className="text-lg font-bold text-gray-800 mb-2">
                            {topThree[1]?.user.name}
                          </div>
                          <div className="flex gap-3 mb-4">
                            <div className="text-center">
                              <div className="text-xs text-gray-500">
                                Solved
                              </div>
                              <div className="font-bold text-gray-800">
                                {topThree[1]?.solved}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500">
                                Streak
                              </div>
                              <div className="font-bold text-orange-500">
                                {topThree[1]?.streak}
                              </div>
                            </div>
                          </div>
                          <div className="bg-blue-500 text-white w-24 h-20 rounded-t-lg flex items-center justify-center">
                            <span className="text-3xl font-bold">2</span>
                          </div>
                        </div>

                        {/* First Place */}
                        <div className="flex flex-col items-center relative -top-6">
                          <div className="text-4xl mb-2">👑</div>
                          <Avatar className="w-20 h-20 mb-3 ring-4 ring-yellow-400">
                            {topThree[0]?.user.photoUrl ? (
                              <AvatarImage
                                src={topThree[0]?.user.photoUrl}
                                alt={topThree[0]?.user.name}
                              />
                            ) : (
                              <AvatarFallback className="text-xl font-bold bg-yellow-500 text-white">
                                {topThree[0]?.user.name.charAt(0)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                            {topThree[0]?.points} Points
                          </div>
                          <div className="text-xl font-bold text-gray-800 mb-2">
                            {topThree[0]?.user.name}
                          </div>
                          <div className="flex gap-3 mb-4">
                            <div className="text-center">
                              <div className="text-xs text-gray-500">
                                Solved
                              </div>
                              <div className="font-bold text-gray-800">
                                {topThree[0]?.solved}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500">
                                Streak
                              </div>
                              <div className="font-bold text-orange-500">
                                {topThree[0]?.streak}
                              </div>
                            </div>
                          </div>
                          <div className="bg-red-500 text-white w-24 h-28 rounded-t-lg flex items-center justify-center">
                            <span className="text-4xl font-bold">1</span>
                          </div>
                        </div>

                        {/* Third Place */}
                        <div className="flex flex-col items-center">
                          <Avatar className="w-16 h-16 mb-3 ring-4 ring-purple-400">
                            {topThree[2]?.user.photoUrl ? (
                              <AvatarImage
                                src={topThree[2]?.user.photoUrl}
                                alt={topThree[2]?.user.name}
                              />
                            ) : (
                              <AvatarFallback className="text-lg font-bold bg-purple-500 text-white">
                                {topThree[2]?.user.name.charAt(0)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                            {topThree[2]?.points} Points
                          </div>
                          <div className="text-lg font-bold text-gray-800 mb-2">
                            {topThree[2]?.user.name}
                          </div>
                          <div className="flex gap-3 mb-4">
                            <div className="text-center">
                              <div className="text-xs text-gray-500">
                                Solved
                              </div>
                              <div className="font-bold text-gray-800">
                                {topThree[2]?.solved}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500">
                                Streak
                              </div>
                              <div className="font-bold text-orange-500">
                                {topThree[2]?.streak}
                              </div>
                            </div>
                          </div>
                          <div className="bg-purple-500 text-white w-24 h-16 rounded-t-lg flex items-center justify-center">
                            <span className="text-2xl font-bold">3</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rest of Leaderboard */}
                    <div className="space-y-4">
                      {remainingUsers.map((user: LeaderboardItem) => (
                        <div
                          key={user.order}
                          className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8">
                              {getRankIcon(user.order)}
                            </div>
                            <Avatar className="w-10 h-10">
                              {user.user.photoUrl ? (
                                <AvatarImage
                                  src={user.user.photoUrl}
                                  alt={user.user.name}
                                />
                              ) : (
                                <AvatarFallback className="bg-gray-500 text-white">
                                  {user.user.name.charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <div className="font-semibold text-gray-800">
                                {user.user.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {user.solved || 0} problems solved
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-sm text-gray-500">
                                Points
                              </div>
                              <div className="font-bold text-gray-800">
                                {user.points.toLocaleString()}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-500">
                                Streak
                              </div>
                              <div className="font-bold text-orange-500">
                                {user.streak} days
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="monthly" className="mt-6">
                    {/* Podium Section */}
                    <div className="mb-8">
                      <div className="flex items-end justify-center gap-4 mb-8">
                        {/* Second Place */}
                        {topThree[1] && (
                          <div className="flex flex-col items-center">
                            <Avatar className="w-16 h-16 mb-3 ring-4 ring-blue-400">
                              {topThree[1]?.user.photoUrl ? (
                                <AvatarImage
                                  src={topThree[1]?.user.photoUrl}
                                  alt={topThree[1]?.user.name}
                                />
                              ) : (
                                <AvatarFallback className="text-lg font-bold bg-blue-500 text-white">
                                  {topThree[1]?.user.name.charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                              {topThree[1]?.points} Points
                            </div>
                            <div className="text-lg font-bold text-gray-800 mb-2">
                              {topThree[1]?.user.name}
                            </div>
                            <div className="flex gap-3 mb-4">
                              <div className="text-center">
                                <div className="text-xs text-gray-500">
                                  Solved
                                </div>
                                <div className="font-bold text-gray-800">
                                  {topThree[1]?.solved || 0}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-500">
                                  Streak
                                </div>
                                <div className="font-bold text-orange-500">
                                  {topThree[1]?.streak}
                                </div>
                              </div>
                            </div>
                            <div className="bg-blue-500 text-white w-24 h-20 rounded-t-lg flex items-center justify-center">
                              <span className="text-3xl font-bold">2</span>
                            </div>
                          </div>
                        )}

                        {/* First Place */}
                        {topThree[0] && (
                          <div className="flex flex-col items-center relative -top-6">
                            <div className="text-4xl mb-2">👑</div>
                            <Avatar className="w-20 h-20 mb-3 ring-4 ring-yellow-400">
                              {topThree[0]?.user.photoUrl ? (
                                <AvatarImage
                                  src={topThree[0]?.user.photoUrl}
                                  alt={topThree[0]?.user.name}
                                />
                              ) : (
                                <AvatarFallback className="text-xl font-bold bg-yellow-500 text-white">
                                  {topThree[0]?.user.name.charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                              {topThree[0]?.points} Points
                            </div>
                            <div className="text-xl font-bold text-gray-800 mb-2">
                              {topThree[0]?.user.name}
                            </div>
                            <div className="flex gap-3 mb-4">
                              <div className="text-center">
                                <div className="text-xs text-gray-500">
                                  Solved
                                </div>
                                <div className="font-bold text-gray-800">
                                  {topThree[0]?.solved || 0}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-500">
                                  Streak
                                </div>
                                <div className="font-bold text-orange-500">
                                  {topThree[0]?.streak}
                                </div>
                              </div>
                            </div>
                            <div className="bg-red-500 text-white w-24 h-28 rounded-t-lg flex items-center justify-center">
                              <span className="text-4xl font-bold">1</span>
                            </div>
                          </div>
                        )}

                        {/* Third Place */}
                        {topThree[2] && (
                          <div className="flex flex-col items-center">
                            <Avatar className="w-16 h-16 mb-3 ring-4 ring-purple-400">
                              {topThree[2]?.user.photoUrl ? (
                                <AvatarImage
                                  src={topThree[2]?.user.photoUrl}
                                  alt={topThree[2]?.user.name}
                                />
                              ) : (
                                <AvatarFallback className="text-lg font-bold bg-purple-500 text-white">
                                  {topThree[2]?.user.name.charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                              {topThree[2]?.points} Points
                            </div>
                            <div className="text-lg font-bold text-gray-800 mb-2">
                              {topThree[2]?.user.name}
                            </div>
                            <div className="flex gap-3 mb-4">
                              <div className="text-center">
                                <div className="text-xs text-gray-500">
                                  Solved
                                </div>
                                <div className="font-bold text-gray-800">
                                  {topThree[2]?.solved || 0}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-500">
                                  Streak
                                </div>
                                <div className="font-bold text-orange-500">
                                  {topThree[2]?.streak}
                                </div>
                              </div>
                            </div>
                            <div className="bg-purple-500 text-white w-24 h-16 rounded-t-lg flex items-center justify-center">
                              <span className="text-2xl font-bold">3</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rest of Leaderboard */}
                    <div className="space-y-4">
                      {remainingUsers.map((user: LeaderboardItem) => (
                        <div
                          key={user.order}
                          className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8">
                              {getRankIcon(user.order)}
                            </div>
                            <Avatar className="w-10 h-10">
                              {user.user.photoUrl ? (
                                <AvatarImage
                                  src={user.user.photoUrl}
                                  alt={user.user.name}
                                />
                              ) : (
                                <AvatarFallback className="bg-gray-500 text-white">
                                  {user.user.name.charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <div className="font-semibold text-gray-800">
                                {user.user.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {user.solved || 0} problems solved
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-sm text-gray-500">
                                Points
                              </div>
                              <div className="font-bold text-gray-800">
                                {user.points.toLocaleString()}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-500">
                                Streak
                              </div>
                              <div className="font-bold text-orange-500">
                                {user.streak} days
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="weekly" className="mt-6">
                    {/* Podium Section */}
                    <div className="mb-8">
                      <div className="flex items-end justify-center gap-4 mb-8">
                        {/* Second Place */}
                        {topThree[1] && (
                          <div className="flex flex-col items-center">
                            <Avatar className="w-16 h-16 mb-3 ring-4 ring-blue-400">
                              {topThree[1]?.user.photoUrl ? (
                                <AvatarImage
                                  src={topThree[1]?.user.photoUrl}
                                  alt={topThree[1]?.user.name}
                                />
                              ) : (
                                <AvatarFallback className="text-lg font-bold bg-blue-500 text-white">
                                  {topThree[1]?.user.name.charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                              {topThree[1]?.points} Points
                            </div>
                            <div className="text-lg font-bold text-gray-800 mb-2">
                              {topThree[1]?.user.name}
                            </div>
                            <div className="flex gap-3 mb-4">
                              <div className="text-center">
                                <div className="text-xs text-gray-500">
                                  Solved
                                </div>
                                <div className="font-bold text-gray-800">
                                  {topThree[1]?.solved || 0}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-500">
                                  Streak
                                </div>
                                <div className="font-bold text-orange-500">
                                  {topThree[1]?.streak}
                                </div>
                              </div>
                            </div>
                            <div className="bg-blue-500 text-white w-24 h-20 rounded-t-lg flex items-center justify-center">
                              <span className="text-3xl font-bold">2</span>
                            </div>
                          </div>
                        )}

                        {/* First Place */}
                        {topThree[0] && (
                          <div className="flex flex-col items-center relative -top-6">
                            <div className="text-4xl mb-2">👑</div>
                            <Avatar className="w-20 h-20 mb-3 ring-4 ring-yellow-400">
                              {topThree[0]?.user.photoUrl ? (
                                <AvatarImage
                                  src={topThree[0]?.user.photoUrl}
                                  alt={topThree[0]?.user.name}
                                />
                              ) : (
                                <AvatarFallback className="text-xl font-bold bg-yellow-500 text-white">
                                  {topThree[0]?.user.name.charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                              {topThree[0]?.points} Points
                            </div>
                            <div className="text-xl font-bold text-gray-800 mb-2">
                              {topThree[0]?.user.name}
                            </div>
                            <div className="flex gap-3 mb-4">
                              <div className="text-center">
                                <div className="text-xs text-gray-500">
                                  Solved
                                </div>
                                <div className="font-bold text-gray-800">
                                  {topThree[0]?.solved || 0}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-500">
                                  Streak
                                </div>
                                <div className="font-bold text-orange-500">
                                  {topThree[0]?.streak}
                                </div>
                              </div>
                            </div>
                            <div className="bg-red-500 text-white w-24 h-28 rounded-t-lg flex items-center justify-center">
                              <span className="text-4xl font-bold">1</span>
                            </div>
                          </div>
                        )}

                        {/* Third Place */}
                        {topThree[2] && (
                          <div className="flex flex-col items-center">
                            <Avatar className="w-16 h-16 mb-3 ring-4 ring-purple-400">
                              {topThree[2]?.user.photoUrl ? (
                                <AvatarImage
                                  src={topThree[2]?.user.photoUrl}
                                  alt={topThree[2]?.user.name}
                                />
                              ) : (
                                <AvatarFallback className="text-lg font-bold bg-purple-500 text-white">
                                  {topThree[2]?.user.name.charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                              {topThree[2]?.points} Points
                            </div>
                            <div className="text-lg font-bold text-gray-800 mb-2">
                              {topThree[2]?.user.name}
                            </div>
                            <div className="flex gap-3 mb-4">
                              <div className="text-center">
                                <div className="text-xs text-gray-500">
                                  Solved
                                </div>
                                <div className="font-bold text-gray-800">
                                  {topThree[2]?.solved || 0}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-500">
                                  Streak
                                </div>
                                <div className="font-bold text-orange-500">
                                  {topThree[2]?.streak}
                                </div>
                              </div>
                            </div>
                            <div className="bg-purple-500 text-white w-24 h-16 rounded-t-lg flex items-center justify-center">
                              <span className="text-2xl font-bold">3</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rest of Leaderboard */}
                    <div className="space-y-4">
                      {remainingUsers.map((user: LeaderboardItem) => (
                        <div
                          key={user.order}
                          className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8">
                              {getRankIcon(user.order)}
                            </div>
                            <Avatar className="w-10 h-10">
                              {user.user.photoUrl ? (
                                <AvatarImage
                                  src={user.user.photoUrl}
                                  alt={user.user.name}
                                />
                              ) : (
                                <AvatarFallback className="bg-gray-500 text-white">
                                  {user.user.name.charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <div className="font-semibold text-gray-800">
                                {user.user.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {user.solved || 0} problems solved
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-sm text-gray-500">
                                Points
                              </div>
                              <div className="font-bold text-gray-800">
                                {user.points.toLocaleString()}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-500">
                                Streak
                              </div>
                              <div className="font-bold text-orange-500">
                                {user.streak} days
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
