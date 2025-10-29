import { runWithAmplifyServerContext } from '@/src/utils/amplify-server';
import { getCurrentUser } from 'aws-amplify/auth';
import { cookies } from 'next/headers';
import { login, logout } from '@/src/app/actions';

// This is a Server Component, so it runs on the server.
export default async function Home() {
  
  // 1. Check if the user is authenticated
  const user = await runWithAmplifyServerContext({
    // We must pass the cookies from next/headers
    nextServerContext: { cookies }, 
    operation: () => getCurrentUser()
  }).catch(() => {
    // This catches errors if the user is not logged in
    console.log("No authenticated user.");
    return null;
  });

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
          <div className="space-y-6">
            <form action={login} className="space-y-5">
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input 
                  name="email" 
                  id="email"
                  type="email" 
                  required 
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-gray-900"
                />
              </div>

              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input 
                  name="password" 
                  id="password"
                  type="password" 
                  required 
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-gray-900"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
            </form>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Create a user in your Cognito User Pool via AWS Console before signing in.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
