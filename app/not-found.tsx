import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-900 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-200 to-cyan-200 dark:from-blue-800 dark:to-cyan-900 rounded-full opacity-20 blur-3xl translate-y-1/3 -translate-x-1/4"></div>
      </div>

      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          {/* Icon Section */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-6xl shadow-xl border-4 border-white dark:border-gray-800 relative">
              🚧
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-sm animate-pulse">
                ⚡
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="mb-10">
            <div className="inline-block bg-gradient-to-r from-indigo-600 to-violet-600 mb-6 px-6 py-2 rounded-full text-white text-sm font-medium">
              StableMind Development
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-300 dark:to-purple-300">
              Work In Progress
            </h1>

            <h2 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              We&apos;re Building Something Amazing
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl mx-auto mb-8">
              This page is currently under development. We&apos;re working hard to bring you new features that will enhance your mental wellness journey during placement season.
            </p>

            {/* Progress indicators */}
            <div className="mb-8">
              <div className="flex justify-center items-center space-x-4 mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Building with care for your mental health
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                🏠 Return Home
              </Link>

              <Link
                href="/dashboard"
                className="inline-block px-8 py-4 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-full text-lg font-medium transition-all hover:bg-indigo-50 dark:hover:bg-gray-700"
              >
                ✨ Explore Dashboard
              </Link>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Meanwhile, try these available features:
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/wellness"
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-full text-sm font-medium transition-all hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                🧘 Wellness Tools
              </Link>
              <Link
                href="/affirmations"
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-full text-sm font-medium transition-all hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                💭 Daily Affirmations
              </Link>
              <Link
                href="/mood"
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-full text-sm font-medium transition-all hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                📊 Mood Tracker
              </Link>
            </div>
          </div>

          {/* Footer Message */}
          <div className="mt-16 text-gray-600 dark:text-gray-400">
            <div className="flex justify-center items-center space-x-3 text-lg">
              <span className="animate-pulse">💜</span>
              <span className="font-medium">Your mental health matters</span>
              <span className="animate-pulse">💜</span>
            </div>
            <div className="mt-2 text-sm opacity-75">
              We&apos;re committed to supporting you through every step of your journey
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}