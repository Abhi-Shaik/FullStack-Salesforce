// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource'; // Import the auth resource we made

// This is the main backend definition
export const backend = defineBackend({
  auth, // Tell the backend to use our auth resource
});