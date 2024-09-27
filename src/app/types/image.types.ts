
export type GeneratedImageData = {
  node_errors: Object;
  number: number;
  prompt_id: string;
};

export type ImageDataAPI = {
  [key: string]: {
    prompt: any;
    outputs: {
      [key: string]: {
        images: ImageMeta[];
      };
    };
  };
};
export type ImageMeta = {
  filename: string;
  subfolder: string;
  type: string;
};
