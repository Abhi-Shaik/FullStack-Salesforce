// src/app/actions.ts
'use server';

import { runWithAmplifyServerContext } from '@/src/utils/amplify-server';
import { signIn, signOut } from 'aws-amplify/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  console.log('Login attempt for:', email);

  try {
    const result = await runWithAmplifyServerContext({
      nextServerContext: null,
      operation: async () => {
        const { isSignedIn, nextStep } = await signIn({
          username: email,
          password,
        });
        
        console.log('Sign-in result:', { isSignedIn, nextStep });
        
        if (!isSignedIn) {
          console.log("Additional steps required:", nextStep);
          throw new Error('Additional authentication steps required');
        }
        
        console.log("Sign-in successful for:", email);
        return { success: true };
      }
    });
    
    if (!result.success) {
      throw new Error('Sign in failed');
    }
  } catch (error) {
    console.error('Error signing in:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
    console.error('Full error:', error);
    // Don't throw - just log for now to see what's happening
    console.error('Login failed for:', email, 'Error:', errorMessage);
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
        console.log('Sign-out successful');
      }
    });
  } catch (error) {
    console.error('Error signing out:', error);
  }
  
  revalidatePath('/'); // Refresh the page
  redirect('/'); // Redirect to home page
}