
import { Code, Users, Award, BookOpen } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Main content */}
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About Solvio</h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Solvio is a platform designed to help developers improve their coding skills through practice,
              challenges, and community collaboration.
            </p>
          </div>

          <Tabs defaultValue="mission">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="mission">Our Mission</TabsTrigger>
              <TabsTrigger value="team">Our Team</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="mission" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Our Mission</CardTitle>
                  <CardDescription>Why we created Solvio and what we aim to achieve</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Solvio was founded in 2023 with a simple mission: to make coding practice accessible, engaging,
                    and effective for developers at all levels.
                  </p>
                  <p>
                    We believe that consistent practice and exposure to diverse problem-solving scenarios are key to
                    becoming a better programmer. Our platform is designed to provide a structured learning path while
                    making the journey enjoyable.
                  </p>
                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="flex flex-col items-center text-center p-4">
                      <div className="bg-[#F8D15B]/20 p-3 rounded-full w-fit mb-4">
                        <Code className="h-6 w-6" />
                      </div>
                      <h3 className="font-medium mb-2">Skill Development</h3>
                      <p className="text-sm text-gray-600">
                        Providing challenges that progressively build coding skills and problem-solving abilities.
                      </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4">
                      <div className="bg-[#F8D15B]/20 p-3 rounded-full w-fit mb-4">
                        <Users className="h-6 w-6" />
                      </div>
                      <h3 className="font-medium mb-2">Community Building</h3>
                      <p className="text-sm text-gray-600">
                        Creating a supportive community where developers can learn from each other.
                      </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4">
                      <div className="bg-[#F8D15B]/20 p-3 rounded-full w-fit mb-4">
                        <Award className="h-6 w-6" />
                      </div>
                      <h3 className="font-medium mb-2">Career Advancement</h3>
                      <p className="text-sm text-gray-600">
                        Helping developers prepare for technical interviews and advance their careers.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Our Team</CardTitle>
                  <CardDescription>The people behind Solvio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      {
                        name: "Alex Johnson",
                        role: "Founder & CEO",
                        bio: "Former software engineer at Google with a passion for algorithms and education.",
                      },
                      {
                        name: "Maria Garcia",
                        role: "CTO",
                        bio: "Full-stack developer with 10+ years of experience building educational platforms.",
                      },
                      {
                        name: "David Kim",
                        role: "Head of Content",
                        bio: "Computer Science PhD with expertise in algorithm design and optimization.",
                      },
                      {
                        name: "Sarah Chen",
                        role: "Community Manager",
                        bio: "Developer advocate focused on building inclusive tech communities.",
                      },
                      {
                        name: "James Wilson",
                        role: "Lead Developer",
                        bio: "Backend specialist with a focus on scalable architecture and performance.",
                      },
                      {
                        name: "Priya Patel",
                        role: "UX Designer",
                        bio: "Designer with a background in cognitive psychology and user experience.",
                      },
                    ].map((member, index) => (
                      <div key={index} className="flex flex-col items-center text-center p-4">
                        <Avatar className="h-20 w-20 mb-4">
                          <AvatarImage
                            src={`/placeholder.svg?height=80&width=80&text=${member.name.charAt(0)}`}
                            alt={member.name}
                          />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-[#F8D15B] mb-2">{member.role}</p>
                        <p className="text-sm text-gray-600">{member.bio}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Features</CardTitle>
                  <CardDescription>What makes Solvio special</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-[#F8D15B]/20 p-2 rounded-full">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Diverse Problem Set</h3>
                          <p className="text-sm text-gray-600">
                            From ciphers to binary trees, explore a wide range of algorithmic challenges across
                            different difficulty levels.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-[#F8D15B]/20 p-2 rounded-full">
                          <Code className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Multiple Language Support</h3>
                          <p className="text-sm text-gray-600">
                            Solve problems in your preferred programming language, with support for Python, JavaScript,
                            Java, C++, and more.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-[#F8D15B]/20 p-2 rounded-full">
                          <Award className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Achievement System</h3>
                          <p className="text-sm text-gray-600">
                            Earn badges and track your progress as you solve problems and improve your skills.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-[#F8D15B]/20 p-2 rounded-full">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Community Solutions</h3>
                          <p className="text-sm text-gray-600">
                            Learn from others by viewing community solutions and discussing different approaches.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>Common questions about Solvio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      question: "Is Solvio free to use?",
                      answer:
                        "Yes, Solvio offers a free tier with access to a wide range of problems. We also offer a premium subscription with additional features and content.",
                    },
                    {
                      question: "How often are new problems added?",
                      answer:
                        "We add new problems weekly, with a focus on keeping content fresh and relevant to current industry trends and interview questions.",
                    },
                    {
                      question: "Can I use Solvio to prepare for technical interviews?",
                      answer:
                        "Many of our problems are designed to help you prepare for technical interviews at top tech companies.",
                    },
                    {
                      question: "Do you offer solutions to the problems?",
                      answer:
                        "Yes, each problem comes with official solutions and explanations. Premium users also get access to video walkthroughs.",
                    },
                    {
                      question: "Can I contribute my own problems to the platform?",
                      answer:
                        "Yes, we welcome community contributions. You can submit your own problems through our contribution portal.",
                    },
                  ].map((item, index) => (
                    <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                      <h3 className="font-medium mb-2">{item.question}</h3>
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Solvio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
