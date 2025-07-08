import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
import Image from "next/image";
import { MainNavbar } from "@/components/layout/Nav/main-navbar";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <MainNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#F8D15B]/50 to-white py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              Grow Your Coding Skills with Solvio
            </h1>
            <p className="text-lg text-gray-700">
              Challenge yourself with our curated collection of coding problems,
              track your progress, and compete with others on the leaderboard.
            </p>
            <div className="flex gap-4">
              <Link href="/register">
                <Button className="bg-[#F8D15B] text-black hover:bg-[#E8C14B] px-6">
                  Get Started
                </Button>
              </Link>
              <Link href="/problems">
                <Button variant="outline" className="px-6">
                  Explore Problems
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/placeholder.svg?height=400&width=500"
              alt="Coding illustration"
              width={500}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Solvio?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-[#F8D15B]/20 p-3 rounded-full w-fit mb-4">
                <Leaf className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Diverse Problem Set
              </h3>
              <p className="text-gray-600">
                From ciphers to binary trees, explore a wide range of
                algorithmic challenges across different difficulty levels.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-[#F8D15B]/20 p-3 rounded-full w-fit mb-4">
                <Leaf className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Track Your Progress
              </h3>
              <p className="text-gray-600">
                Monitor your growth with detailed statistics and visualize your
                improvement over time.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-[#F8D15B]/20 p-3 rounded-full w-fit mb-4">
                <Leaf className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Compete & Collaborate
              </h3>
              <p className="text-gray-600">
                Join the leaderboard, compete with peers, and learn from the
                community&apos;s solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                &quot;Solvio has been instrumental in helping me prepare for
                technical interviews. The problems are challenging and
                relevant.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F8D15B] rounded-full"></div>
                <div>
                  <p className="font-semibold">Alex Johnson</p>
                  <p className="text-sm text-gray-500">Software Engineer</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                &quot;I love the variety of problems and the clean interface.
                It&apos;s become my go-to platform for daily coding
                practice.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F8D15B] rounded-full"></div>
                <div>
                  <p className="font-semibold">Maria Garcia</p>
                  <p className="text-sm text-gray-500">CS Student</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                &quot;The leaderboard feature keeps me motivated to solve more
                problems and improve my ranking. Great community!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F8D15B] rounded-full"></div>
                <div>
                  <p className="font-semibold">David Kim</p>
                  <p className="text-sm text-gray-500">Web Developer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#F8D15B]/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Level Up Your Coding Skills?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are improving their problem-solving
            abilities with Solvio.
          </p>
          <Link href="/register">
            <Button className="bg-[#F8D15B] text-black hover:bg-[#E8C14B] px-8 py-6 text-lg">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="md:w-1/3">
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-6 w-6" />
                <span className="font-semibold text-xl">Solvio</span>
              </div>
              <p className="text-gray-300">
                A platform for developers to enhance their coding skills through
                practice and challenges.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/public" className="text-gray-300 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/problems"
                    className="text-gray-300 hover:text-white"
                  >
                    Problems
                  </Link>
                </li>
                <li>
                  <Link
                    href="/leaderboard"
                    className="text-gray-300 hover:text-white"
                  >
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-300 hover:text-white"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Discord
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Solvio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
