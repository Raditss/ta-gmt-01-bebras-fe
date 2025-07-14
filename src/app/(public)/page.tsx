import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Users, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image
            src="/graphic/Solvio-logo.svg"
            alt="logo"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-gray-600 hover:text-gray-800">
            Features
          </Link>
          <Link href="#about" className="text-gray-600 hover:text-gray-800">
            About
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-gray-800">
            Login
          </Link>
          <Button asChild>
            <Link href="/register">Register</Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-gray-800 leading-tight">
              Grow Your Computational Thinking Skills with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
                Solvio
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Challenge yourself with our curated collection of problems, track
              your progress, and compete with others on the leaderboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Explore Problems</Link>
              </Button>
            </div>
          </div>
          <div className="relative drop-shadow-2xl ml-18">
            <Image
              src="/graphic/landing-page.svg"
              alt="solvio"
              width={500}
              height={500}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Why Choose Solvio?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform offers an interactive way to learn computational
            thinking skills.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Diverse Problem Set
              </h3>
              <p className="text-gray-600">
                Access all the carefully crafted problems across multiple
                topics.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Track Your Progress
              </h3>
              <p className="text-gray-600">
                Monitor your learning journey with detailed analytics and
                progress tracking.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Compete & Collaborate
              </h3>
              <p className="text-gray-600">
                Join a community of learners, compete on leaderboards, and learn
                together.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-500 to-blue-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Computational Thinking Journey?
          </h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students already improving their computational
            thinking skills.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">Get Started for Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg"></div>
                <span className="text-xl font-bold">Solvio</span>
              </div>
              <p className="text-gray-400">
                Empowering the next generation of computational thinkers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/problems">Problems</Link>
                </li>
                <li>
                  <Link href="/leaderboard">Leaderboard</Link>
                </li>
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help">Help Center</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
                <li>
                  <Link href="/feedback">Feedback</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 solvio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
