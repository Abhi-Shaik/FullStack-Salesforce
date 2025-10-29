import { runWithAmplifyServerContext } from '@/src/utils/amplify-server';
import { getCurrentUser } from 'aws-amplify/auth';
import { cookies } from 'next/headers';
import { login, logout } from '@/src/app/actions';
import { LoginForm } from './LoginForm';

// This is a Server Component, so it runs on the server.
export default async function Home() {
  
  console.log('🔍 Page rendering - checking authentication...');
  
  // 1. Check if the user is authenticated
  const user = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async () => {
      try {
        const currentUser = await getCurrentUser();
        console.log('✅ User authenticated:', currentUser.username || currentUser.userId);
        return currentUser;
      } catch {
        console.log("❌ No authenticated user");
        return null;
      }
    }
  });
  
  console.log('🎯 Authentication state:', user ? 'LOGGED IN' : 'LOGGED OUT');

  // 2. Render UI based on auth state
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">AWS Amplify Authentication</p>
        </div>

        {user ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Welcome, {user.signInDetails?.loginId || user.username}
              </h3>
              <p className="text-sm text-green-700">User ID: {user.userId}</p>
            </div>
            <form action={logout}>
              <button 
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                Sign Out
              </button>
            </form>
          </div>
        ) : (
          <LoginForm onLogin={login} />
        )}
      </div>
    </main>
  );
}
