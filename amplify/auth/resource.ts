import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  // This is where you define your auth logic in code
  loginWith: {
    email: true, // This enables email + password login
  },
});