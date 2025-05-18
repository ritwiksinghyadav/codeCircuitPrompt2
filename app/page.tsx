import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">✈️ WanderBoard</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-pink-500 transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-pink-500 transition-colors" href="#">
            About
          </Link>
          {/* <Link 
            className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:opacity-90 transition-opacity" 
            href="#"
          >
            Login
          </Link> */}
        </nav>
      </header>
      <main className="flex-1 pt-16">
        <section className="w-full py-24 md:py-32 lg:py-40 bg-gradient-to-b from-white to-pink-50">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl text-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-700 text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                </span>
                New: AI Trip Suggestions
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none bg-gradient-to-r from-gray-900 via-pink-500 to-purple-500 text-transparent bg-clip-text animate-gradient">
                Plan Your Trips Like a Pro
              </h1>
              <p className="max-w-2xl mx-auto text-gray-600 md:text-xl dark:text-gray-400 leading-relaxed">
                Create beautiful, interactive day-by-day trip itineraries with our drag-and-drop board. Make
                organizing travel feel as fun as the adventure itself.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/planner">
                  <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90 transition-opacity shadow-lg shadow-pink-500/20 w-full sm:w-auto">
                    Start Planning <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="hover:bg-pink-50 transition-colors w-full sm:w-auto">
                    Explore Features
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 px-4 py-1.5 text-sm font-medium text-pink-500">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-gray-900 to-gray-700 text-transparent bg-clip-text">
                  Plan Your Trip Your Way
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to create the perfect travel itinerary with a vibe that matches your style.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-8 py-12 lg:grid-cols-3 lg:gap-12">
              {[
                {
                  title: "Visual Itinerary Board",
                  description: "Organize your trip with Trello-style columns for each day and drag-and-drop activity cards.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-pink-500"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M3 9h18" />
                      <path d="M9 21V9" />
                    </svg>
                  ),
                  color: "pink"
                },
                {
                  title: "Aesthetic Customization",
                  description: "Choose trip themes, color palettes, and vibe stickers to match your personal style.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-purple-500"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="M12 18v-6" />
                      <path d="M8 18v-1" />
                      <path d="M16 18v-3" />
                    </svg>
                  ),
                  color: "purple"
                },
                {
                  title: "Smart UI Feedback",
                  description: "Get warnings for time overlaps and highlights for free time gaps in your schedule.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-blue-500"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  ),
                  color: "blue"
                }
              ].map((feature, index) => (
                <div key={index} className="group flex flex-col justify-center space-y-4 p-6 rounded-2xl transition-all hover:bg-gray-50">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-900 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">About WanderBoard</h4>
              <p className="text-sm text-gray-500">Making travel planning as enjoyable as the journey itself.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <nav className="flex flex-col space-y-2">
                <Link className="text-sm text-gray-500 hover:text-pink-500 transition-colors" href="#">Features</Link>
                <Link className="text-sm text-gray-500 hover:text-pink-500 transition-colors" href="#">About</Link>
                <Link className="text-sm text-gray-500 hover:text-pink-500 transition-colors" href="#">Login</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Legal</h4>
              <nav className="flex flex-col space-y-2">
                <Link className="text-sm text-gray-500 hover:text-pink-500 transition-colors" href="#">Terms of Service</Link>
                <Link className="text-sm text-gray-500 hover:text-pink-500 transition-colors" href="#">Privacy Policy</Link>
              </nav>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t">
            <p className="text-sm text-gray-500 text-center">© 2025 WanderBoard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
