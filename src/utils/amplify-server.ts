// src/utils/amplify-server.ts
import { createServerRunner } from '@aws-amplify/adapter-nextjs';

// Make sure this path is correct:
// It goes from src/utils -> src -> root
import config from '../../amplify_outputs.json'; 

export const { runWithAmplifyServerContext } = createServerRunner({
  config
});