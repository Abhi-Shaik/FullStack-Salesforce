// src/utils/amplify-server.ts
import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { Amplify } from 'aws-amplify';

// Make sure this path is correct:
// It goes from src/utils -> src -> root
import config from '../../amplify_outputs.json'; 

// Configure Amplify for server-side
Amplify.configure(config, { ssr: true });

export const { runWithAmplifyServerContext } = createServerRunner({
  config
});