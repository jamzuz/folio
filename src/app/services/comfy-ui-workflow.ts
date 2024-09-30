export const generateWorkflow = (
  positivePrompt: string,
  negativePrompt = '(low quality, worst quality:1.4), cgi, text, signature, watermark, extra limbs, ((nipples))'
) => {
  return {
    prompt: {
      '3': {
        inputs: {
          seed: 831722483841814,
          steps: 7,
          cfg: 2,
          sampler_name: 'dpmpp_sde',
          scheduler: 'karras',
          denoise: 1,
          model: ['4', 0],
          positive: ['6', 0],
          negative: ['7', 0],
          latent_image: ['5', 0],
        },
        class_type: 'KSampler',
        _meta: {
          title: 'KSampler',
        },
      },
      '4': {
        inputs: {
          ckpt_name: 'dreamshaperXL_v21TurboDPMSDE.safetensors',
        },
        class_type: 'CheckpointLoaderSimple',
        _meta: {
          title: 'Load Checkpoint',
        },
      },
      '5': {
        inputs: {
          width: 768,
          height: 1024,
          batch_size: 1,
        },
        class_type: 'EmptyLatentImage',
        _meta: {
          title: 'Empty Latent Image',
        },
      },
      '6': {
        inputs: {
          text: positivePrompt,
          clip: ['4', 1],
        },
        class_type: 'CLIPTextEncode',
        _meta: {
          title: 'CLIP Text Encode (Prompt)',
        },
      },
      '7': {
        inputs: {
          text: negativePrompt,
          clip: ['4', 1],
        },
        class_type: 'CLIPTextEncode',
        _meta: {
          title: 'CLIP Text Encode (Prompt)',
        },
      },
      '8': {
        inputs: {
          samples: ['3', 0],
          vae: ['4', 2],
        },
        class_type: 'VAEDecode',
        _meta: {
          title: 'VAE Decode',
        },
      },
      '9': {
        inputs: {
          filename_prefix: 'ComfyUI',
          images: ['8', 0],
        },
        class_type: 'SaveImage',
        _meta: {
          title: 'Save Image',
        },
      },
      '40': {
        inputs: {
          upscale_method: 'bicubic',
          scale_by: 1.5,
          image: ['8', 0],
        },
        class_type: 'ImageScaleBy',
        _meta: {
          title: 'Upscale Image By',
        },
      },
      '41': {
        inputs: {
          pixels: ['40', 0],
          vae: ['4', 2],
        },
        class_type: 'VAEEncode',
        _meta: {
          title: 'VAE Encode',
        },
      },
    },
  };
};
