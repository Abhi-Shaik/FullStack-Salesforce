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
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Amplify Auth with HttpOnly Cookies</h1>
      {user ? (
        <div>
          <h3>Welcome, {user.signInDetails?.loginId || user.username}</h3>
          <p>User ID: {user.userId}</p>
          <form action={logout}>
            <button type="submit">Sign Out</button>
          </form>
        </div>
      ) : (
        <div>
          <h3>You are not signed in.</h3>
          <form action={login}>
            <label htmlFor="email">Email</label>
            <br />
            <input name="email" type="email" required />
            <br />
            <br />
            <label htmlFor="password">Password</label>
            <br />
            <input name="password" type="password" required />
            <br />
            <br />
            <button type="submit">Sign In</button>
          </form>
          <p style={{ marginTop: '2rem' }}>
            <strong>Note:</strong> You must create a user account first.
            <br />
            Go to your <strong>Cognito User Pool</strong> in the AWS Console to manually create a user.
          </p>
        </div>
      )}
    </main>
  );
}
