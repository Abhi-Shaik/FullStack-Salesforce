// src/app/actions.ts
'use server';

import { runWithAmplifyServerContext } from '@/src/utils/amplify-server';
import { signIn, signOut } from 'aws-amplify/auth';
import { revalidatePath } from 'next/cache';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // This function automatically uses secure, HttpOnly cookies
  await runWithAmplifyServerContext({
    nextServerContext: null,
    operation: async () => {
      try {
        const { isSignedIn } = await signIn({
          username: email,
          password,
        });
        
        if (isSignedIn) {
          console.log("Sign-in successful");
        }

      } catch (error) {
        console.error('Error signing in:', error);
        // You can add error handling here
      }
    },
  });
  
  revalidatePath('/'); // Refresh the page to show the new auth state
}

export async function logout() {
  await runWithAmplifyServerContext({
    nextServerContext: null,
    operation: async () => {
      await signOut();
    },
  });
  
  revalidatePath('/'); // Refresh the page
}