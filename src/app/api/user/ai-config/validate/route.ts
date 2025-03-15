import type { AIModelConfig } from '@/services/ai/MarketingAI';
import { NextResponse } from 'next/server';

async function validateHuggingFaceModel(modelId: string, apiKey: string) {
  try {
    const response = await fetch(`https://huggingface.co/api/models/${modelId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function validateOpenAIModel(modelId: string, apiKey: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data.data.some((model: { id: string }) => model.id === modelId);
  } catch {
    return false;
  }
}

async function validateReplicateModel(modelId: string, apiKey: string) {
  try {
    const [owner, name, version] = modelId.split('/');
    const response = await fetch(`https://api.replicate.com/v1/models/${owner}/${name}/versions/${version}`, {
      headers: {
        Authorization: `Token ${apiKey}`,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { model, apiKey } = await request.json();

    if (!model || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const modelConfig = model as AIModelConfig;
    let isValid = false;

    switch (modelConfig.provider) {
      case 'huggingface':
        isValid = await validateHuggingFaceModel(modelConfig.modelId, apiKey);
        break;
      case 'openai':
        isValid = await validateOpenAIModel(modelConfig.modelId, apiKey);
        break;
      case 'replicate':
        isValid = await validateReplicateModel(modelConfig.modelId, apiKey);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid provider' },
          { status: 400 },
        );
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid model ID or API key' },
        { status: 400 },
      );
    }

    // Get default parameters based on model type
    const defaultParams: Record<string, unknown> = {
      text: {
        max_length: 1000,
        temperature: 0.7,
        top_p: 0.9,
      },
      image: {
        width: 1024,
        height: 1024,
        num_inference_steps: 50,
        guidance_scale: 7.5,
      },
      video: {
        num_frames: 50,
        fps: 30,
        width: 1024,
        height: 1024,
      },
      audio: {
        sample_rate: 44100,
        duration: 10,
      },
    }[modelConfig.type] || {};

    return NextResponse.json({
      isValid: true,
      defaultParams,
    });
  } catch (error) {
    console.error('Error validating model:', error);
    return NextResponse.json(
      { error: 'Failed to validate model' },
      { status: 500 },
    );
  }
}
