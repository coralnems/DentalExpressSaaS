# Setup and Configuration Guide

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- API keys for:
  - OpenAI
  - Hugging Face
  - Replicate
  - ElevenLabs

## Installation

1. Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd <project-directory>
npm install
```

2. Set up environment variables:
Create a `.env.local` file with the following variables:
```env
OPENAI_API_KEY=your-openai-api-key
HUGGINGFACE_API_KEY=your-huggingface-api-key
REPLICATE_API_KEY=your-replicate-api-key
ELEVENLABS_API_KEY=your-elevenlabs-api-key
```

## AI Model Configuration

### Available Model Types
- Text Generation
- Image Generation
- Video Generation
- Audio Generation
- Voice Synthesis

### Supported Providers
1. **OpenAI**
   - Text models: GPT-4, GPT-3.5
   - Image models: DALL-E 3
   - Video models: SORA

2. **Hugging Face**
   - Text models: Mistral-7B, Claude AI Sonnet
   - Image models: Stable Diffusion XL

3. **Replicate**
   - Video models: Zeroscope
   - Audio models: Bark

4. **ElevenLabs**
   - Voice models: Multilingual v2 (29 languages)
   - Fast voice: Flash v2.5 (32 languages)
   - Voice cloning and dubbing capabilities

### Adding Custom Models

1. Navigate to `/dashboard/settings/ai-models`
2. Enter your API keys for the desired providers
3. Click "Add New Model" and fill in:
   - Provider
   - Model Name
   - Model ID
   - Content Type
   - Description
   - A/B Testing Configuration (optional)

### Model Parameters

Default parameters are provided for each content type:

1. **Text Models**
```json
{
  "max_length": 1000,
  "temperature": 0.7,
  "top_p": 0.9
}
```

2. **Image Models**
```json
{
  "width": 1024,
  "height": 1024,
  "num_inference_steps": 50,
  "guidance_scale": 7.5
}
```

3. **Video Models**
```json
{
  "num_frames": 50,
  "fps": 30,
  "width": 1024,
  "height": 1024,
  "motion_bucket_id": 127,
  "cond_aug": 0.02
}
```

4. **Audio Models**
```json
{
  "sample_rate": 44100,
  "duration": 10,
  "voice_settings": {
    "stability": 0.5,
    "similarity_boost": 0.75
  }
}
```

### A/B Testing Configuration

Enable A/B testing for your marketing flows to optimize content performance:

1. **Test Setup**
   - Define test variants (up to 5 per flow)
   - Set variant distribution percentages
   - Configure success metrics

2. **Test Parameters**
   - Model selection per variant
   - Content parameters
   - Scheduling variations
   - Target audience segments

3. **Performance Tracking**
   - Engagement rates
   - Conversion metrics
   - Statistical significance
   - Automated winner selection

## Marketing Automation

### Supported Channels
- Blog
- Twitter
- LinkedIn
- Instagram
- Facebook
- TikTok
- Telegram
- WhatsApp
- Email

### Content Types
- Posts
- Articles
- Images
- Videos
- Stories
- Reels
- Messages
- Voice Messages
- Video Messages

### Channel-Specific Features

Each channel has optimized settings for:
- Character limits
- Hashtag usage
- Content types
- Peak engagement times
- A/B testing parameters

### Setting Up Marketing Flows

1. Define flow objectives
2. Select target channels
3. Configure AI models for content generation
4. Set up A/B testing variants
5. Configure scheduling and triggers
6. Enable performance tracking

### Performance Metrics
- Impressions
- Engagement rates
- Click-through rates
- Conversions
- ROI
- A/B test results
- Statistical confidence levels

## Troubleshooting

### Common Issues

1. **API Key Validation Errors**
   - Verify API key format
   - Check provider access permissions
   - Ensure sufficient API credits

2. **Model Loading Issues**
   - Verify model ID exists
   - Check provider status
   - Confirm model access permissions

3. **Content Generation Failures**
   - Review input parameters
   - Check content type compatibility
   - Verify API rate limits

4. **A/B Testing Issues**
   - Check variant distribution
   - Verify tracking setup
   - Confirm statistical significance

### Support

For additional support:
1. Check the API provider documentation
2. Review error logs
3. Contact system administrator
