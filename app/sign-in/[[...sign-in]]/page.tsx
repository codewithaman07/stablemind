import { SignIn } from '@clerk/nextjs';
import Logo from '../../components/Logo';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-md w-full space-y-8 p-8 rounded-2xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white" style={{ background: 'var(--accent-primary)' }}>
              <Logo size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Welcome to StableMind</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Sign in to continue your mental wellness journey</p>
        </div>
        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: 'font-medium transition-all text-white border-0',
                card: 'shadow-none border-0 bg-transparent',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                formFieldInput: 'border-gray-600 bg-gray-700 text-white',
                formFieldLabel: 'text-gray-300',
                footerActionLink: 'text-emerald-500 hover:text-emerald-400',
                dividerLine: 'bg-gray-600',
                dividerText: 'text-gray-400',
                socialButtonsBlockButton: 'border-gray-600 hover:bg-gray-700',
                socialButtonsBlockButtonText: 'text-gray-300',
              },
              variables: {
                colorPrimary: '#10a37f', // Match new accent
                colorBackground: 'transparent',
                colorText: '#ececec',
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
