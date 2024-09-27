import { EventEmitter, Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { generateWorkflow } from './comfy-ui-workflow';
import {
  GeneratedImageData,
  ImageDataAPI,
  ImageMeta,
} from '../types/image.types';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  generatedImage: GeneratedImageData | undefined;
  imageDataEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor(private webSocketService: WebSocketService) {
    this.webSocketService.messageEmitter.subscribe(
      this.handleWebSocketMessage.bind(this)
    );
  }

  private async handleWebSocketMessage(event: MessageEvent): Promise<void> {
    console.log('WebSocket message received:', event.data);
    const eventData = JSON.parse(event.data);
    if (
      eventData.type === 'status' &&
      eventData.data?.status?.exec_info?.queue_remaining === 0 &&
      !eventData.data.sid
    ) {
      try {
        const imageData = await this.getImagesFromHistory();
        this.imageDataEmitter.emit(imageData);
      } catch (error) {
        console.error('Error getting images from history:', error);
      }
    }
  }

  async generateImage(prompt: string): Promise<void> {
    if (!this.webSocketService.isConnected()) {
      console.warn('WebSocket is not connected. Skipping image generation.');
      return;
    }

    const workflow = generateWorkflow(prompt);
    const response = await fetch(`/api/prompt`, {
      method: 'POST',
      body: JSON.stringify(workflow),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    this.generatedImage = data;
  }

  async getHistory(): Promise<ImageDataAPI> {
    const response = await fetch(`/api/history`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async getImagesFromHistory(): Promise<string> {
    const history = await this.getHistory();
    const promptId = this.generatedImage?.prompt_id;
    if (!promptId) {
      throw new Error('No prompt id found');
    }

    const imageDataFromHistory = history[promptId]?.outputs;
    if (!imageDataFromHistory) {
      throw new Error('No image data found in history');
    }

    const imageMeta = Object.values(imageDataFromHistory).flatMap(
      (output) => output.images
    )[0];
    if (!imageMeta) {
      throw new Error('No images found in history');
    }

    const image = await this.getImage(imageMeta);
    const imageBlob = await image.blob();
    return this.convertBlobToBase64(imageBlob);
  }

  async getImage(imageMeta: ImageMeta): Promise<Response> {
    const response = await fetch(
      `/api/view?filename=${imageMeta.filename}&subfolder=${imageMeta.subfolder}&type=${imageMeta.type}`,
      {
        method: 'GET',
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  }

  private convertBlobToBase64(blob: Blob): Promise<string> {
    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
