import type { UserAIConfig } from '@/services/ai/MarketingAI';
import { NextResponse } from 'next/server';

// In a real application, this would be stored in a database
let mockUserConfig: UserAIConfig = {
  huggingface: {
    apiKey: '',
    models: [
      {
        id: 'sdxl',
        name: 'Stable Diffusion XL',
        provider: 'huggingface',
        modelId: 'stabilityai/stable-diffusion-xl-base-1.0',
        type: 'image',
        description: 'High-quality image generation model',
        parameters: {
          negative_prompt: 'blurry, bad quality, distorted',
        },
        isEnabled: true,
      },
      {
        id: 'mistral',
        name: 'Mistral-7B',
        provider: 'huggingface',
        modelId: 'mistralai/Mistral-7B-v0.1',
        type: 'text',
        description: 'Advanced language model for text generation',
        parameters: {},
        isEnabled: true,
      },
    ],
  },
  openai: {
    apiKey: '',
    models: [
      {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'openai',
        modelId: 'gpt-4',
        type: 'text',
        description: 'Advanced language model for text generation',
        parameters: {},
        isEnabled: true,
      },
      {
        id: 'dall-e-3',
        name: 'DALL-E 3',
        provider: 'openai',
        modelId: 'dall-e-3',
        type: 'image',
        description: 'High-quality image generation model',
        parameters: {
          quality: 'hd',
          style: 'vivid',
        },
        isEnabled: true,
      },
    ],
  },
  replicate: {
    apiKey: '',
    models: [
      {
        id: 'zeroscope',
        name: 'Zeroscope',
        provider: 'replicate',
        modelId: 'anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351',
        type: 'video',
        description: 'Advanced video generation model',
        parameters: {
          frames: 50,
          fps: 30,
        },
        isEnabled: true,
      },
      {
        id: 'bark',
        name: 'Bark',
        provider: 'replicate',
        modelId: 'suno/bark:b76242b40d67c76ab6742e987628478ed2fb5265e6f09fd3f7b06aa6067072d5',
        type: 'audio',
        description: 'Text-to-speech synthesis model',
        parameters: {
          voice_preset: 'v2/en_speaker_6',
        },
        isEnabled: true,
      },
    ],
  },
};

export async function GET() {
  // In a real application, fetch from database based on user session
  return NextResponse.json(mockUserConfig);
}

export async function PUT(request: Request) {
  try {
    const newConfig = await request.json();

    // Validate the config structure
    if (
      !newConfig.huggingface
      || !newConfig.openai
      || !newConfig.replicate
      || !Array.isArray(newConfig.huggingface.models)
      || !Array.isArray(newConfig.openai.models)
      || !Array.isArray(newConfig.replicate.models)
    ) {
      return NextResponse.json(
        { error: 'Invalid configuration structure' },
        { status: 400 },
      );
    }

    // In a real application, validate API keys by making test requests
    // and save to database if valid

    mockUserConfig = newConfig;

    return NextResponse.json(mockUserConfig);
  } catch (error) {
    console.error('Error updating AI configuration:', error);
    return NextResponse.json(
      { error: 'Failed to update AI configuration' },
      { status: 500 },
    );
  }
}
