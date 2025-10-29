// src/app/actions.ts
'use server';

import { runWithAmplifyServerContext } from '@/src/utils/amplify-server';
import { signIn, signOut } from 'aws-amplify/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    // This function automatically uses secure, HttpOnly cookies
    await runWithAmplifyServerContext({
      nextServerContext: null,
      operation: async () => {
        const { isSignedIn, nextStep } = await signIn({
          username: email,
          password,
        });
        
        if (isSignedIn) {
          console.log("Sign-in successful");
        } else {
          console.log("Additional steps required:", nextStep);
        }
      },
    });
  } catch (error) {
    console.error('Error signing in:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
    throw new Error(errorMessage);
  }
  
  revalidatePath('/'); // Refresh the page to show the new auth state
  redirect('/'); // Redirect to home page
}

export async function logout() {
  try {
    await runWithAmplifyServerContext({
      nextServerContext: null,
      operation: async () => {
        await signOut();
      },
    });
  } catch (error) {
    console.error('Error signing out:', error);
  }
  
  revalidatePath('/'); // Refresh the page
  redirect('/'); // Redirect to home page
}