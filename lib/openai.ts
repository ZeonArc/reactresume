import OpenAI from 'openai';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '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',
});

export default openai; 