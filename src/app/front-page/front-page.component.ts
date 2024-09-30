import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { OllamaService } from '../services/ollama.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-front-page',
  standalone: true,
  imports: [FormsModule, NgFor, CommonModule],
  templateUrl: './front-page.component.html',
  styleUrl: './front-page.component.css',
})
export class FrontPageComponent implements AfterViewInit {
  chatHistory: Array<string> = [];
  message: string = '';
  llamaMessage: string = '';
  working: boolean = false;
  image: string = './bg-new.jpg';
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  latestMessage: string = '';

  constructor(
    private llama: OllamaService,
    private imageService: ImageService
  ) {
    this.llama.getLlamaChat().subscribe((llamaChat) => {
      this.llamaMessage = this.llamaMessage + llamaChat;
      if (this.scrollContainer) {
        this.scrollToBottom();
      }
    });
    if (this.llama.getFromLocalStorage().length) {
      this.chatHistory = this.llama.getMessages();
      console.log('data found from local storage, resuming chat');
    } else {
      console.log('no data from local storage found, starting from scratch');
    }

    this.imageService.imageDataEmitter.subscribe((imageData: string) => {
      console.log('image data received:', imageData);
      this.image = imageData;
    });
  }
  ngAfterViewInit(): void {
    this.scrollToBottom();
  }
  sendMessage() {
    this.working = true;
    this.chatHistory.push(this.message);
    this.scrollToBottom();
    this.llama
      .talkToLlama(this.message)
      .then(() => {
        this.message = '';
      })
      .finally(() => {
        this.latestMessage = this.llamaMessage;
        this.chatHistory.push(this.latestMessage);
        this.generateImage();
        this.llamaMessage = '';
        this.scrollToBottom();
        this.working = false;
      });
  }

  generateImage() {
    this.llama.generateImagePrompt(this.latestMessage).then((prompt) => {
      this.imageService.generateImage(prompt).catch((error) => {
        console.error('Error generating image:', error);
      });
    });
  }

  scrollToBottom(): void {
    const container = this.scrollContainer.nativeElement;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }
}
