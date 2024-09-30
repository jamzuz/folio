import { Injectable, EventEmitter } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private ws: WebSocket | null = null;
  private readonly serverAddress = 'localhost:8188';
  private readonly clientId = uuidv4();
  messageEmitter: EventEmitter<MessageEvent> = new EventEmitter<MessageEvent>();

  constructor() {
    this.openWebSocketConnection();
  }

  private openWebSocketConnection(): void {
    try {
      this.ws = new WebSocket(`ws://${this.serverAddress}/ws?clientId=${this.clientId}`);

      this.ws.onopen = this.handleWebSocketOpen;
      this.ws.onmessage = this.handleWebSocketMessage.bind(this);
      this.ws.onclose = this.handleWebSocketClose;
      this.ws.onerror = this.handleWebSocketError;
    } catch (error) {
      console.error('Failed to open WebSocket connection:', error);
    }
  }

  private handleWebSocketOpen(): void {
    console.log('WebSocket connection opened');
  }

  private handleWebSocketMessage(event: MessageEvent): void {
    console.log('WebSocket message received:', event.data);
    this.messageEmitter.emit(event);
  }

  private handleWebSocketClose(event: CloseEvent): void {
    console.log('WebSocket connection closed:', event);
  }

  private handleWebSocketError(error: Event): void {
    console.error('WebSocket error:', error);
  }

  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}
