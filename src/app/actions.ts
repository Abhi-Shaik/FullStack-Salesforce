// src/app/actions.ts
'use server';

import { runWithAmplifyServerContext } from '@/src/utils/amplify-server';
import { signIn, signOut } from 'aws-amplify/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  console.log('🔐 SERVER ACTION: Login attempt for:', email);
  console.log('🔐 Password length:', password?.length || 0);

  try {
    const result = await runWithAmplifyServerContext({
      nextServerContext: null,
      operation: async () => {
        console.log('🔐 Calling Amplify signIn...');
        
        const { isSignedIn, nextStep } = await signIn({
          username: email,
          password,
        });
        
        console.log('🔐 Sign-in result:', { 
          isSignedIn, 
          nextStep: nextStep?.signInStep || 'NONE' 
        });
        
        if (!isSignedIn) {
          console.log("⚠️  Additional steps required:", nextStep);
          throw new Error(`Additional authentication steps required: ${nextStep?.signInStep}`);
        }
        
        console.log("✅ Sign-in successful for:", email);
        return { success: true };
      }
    });
    
    if (!result.success) {
      console.error('❌ Sign in result was not successful');
      throw new Error('Sign in failed');
    }
    
    console.log('✅ Login action completed successfully, redirecting...');
  } catch (error) {
    console.error('❌ ERROR in login action:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
    console.error('❌ Error details:', {
      message: errorMessage,
      type: error instanceof Error ? error.constructor.name : typeof error,
      email: email
    });
    
    // Re-throw the error so the client can display it
    throw new Error(errorMessage);
  }
  
  console.log('🔄 Revalidating path and redirecting...');
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