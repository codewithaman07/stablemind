import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center text-3xl font-bold text-purple-300">
              SM
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Join StableMind</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Create your account to start your mental wellness journey</p>
        </div>
        <div className="flex justify-center">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium',
                card: 'shadow-2xl border-0 bg-white dark:bg-gray-800',
                headerTitle: 'text-gray-900 dark:text-white',
                headerSubtitle: 'text-gray-600 dark:text-gray-300',
                formFieldInput: 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white',
                formFieldLabel: 'text-gray-700 dark:text-gray-300',
                footerActionLink: 'text-indigo-600 hover:text-indigo-700',
                dividerLine: 'bg-gray-300 dark:bg-gray-600',
                dividerText: 'text-gray-500 dark:text-gray-400',
                socialButtonsBlockButton: 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
                socialButtonsBlockButtonText: 'text-gray-700 dark:text-gray-300',
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
