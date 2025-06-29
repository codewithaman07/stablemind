import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-900 to-indigo-900 rounded-full flex items-center justify-center text-4xl border border-purple-700">
            🤔
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-6xl font-bold text-purple-500 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-white mb-2">Page Not Found</h2>
          <p className="text-gray-400 leading-relaxed">
            Looks like you've wand  ered off the path. The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            🏠 Return Home
          </Link>
          
          <div className="text-sm text-gray-500">
            Or try one of these helpful links:
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link 
              href="/wellness"
              className="text-purple-400 hover:text-purple-300 text-sm underline-offset-4 hover:underline transition-colors"
            >
              Wellness Tools
            </Link>
            <Link 
              href="/affirmations"
              className="text-purple-400 hover:text-purple-300 text-sm underline-offset-4 hover:underline transition-colors"
            >
              Daily Affirmations
            </Link>
            
          </div>
        </div>

        <div className="mt-12 text-gray-600">
          <div className="flex justify-center space-x-2 text-sm">
            <span>✨</span>
            <span>Stay positive</span>
            <span>✨</span>
          </div>
        </div>
      </div>
    </div>
  )
}