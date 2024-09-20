import { Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { OllamaService } from '../services/ollama.service';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-front-page',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './front-page.component.html',
  styleUrl: './front-page.component.css'
})

export class FrontPageComponent implements AfterViewInit{
  chatHistory: Array<string> = []
  message: string = ""
  llamaMessage: string = ""
  working: boolean = false;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  constructor(private llama: OllamaService) {

    this.llama.getLlamaChat().subscribe(llamaChat => {
      this.llamaMessage = this.llamaMessage + llamaChat
      if(this.scrollContainer){
        this.scrollToBottom()
      }
    })
    if(this.llama.getFromLocalStorage().length){
      this.chatHistory = this.llama.getMessages()
      console.log("data found from local storage, resuming chat")
    }else{
      console.log("no data from local storage found, starting from scratch")
    }
  }
  ngAfterViewInit(): void {
    this.scrollToBottom()
  }
  sendMessage() {
    this.working = true
    this.chatHistory.push(this.message)
    this.scrollToBottom()
    this.llama.talkToLlama(this.message)
      .then(() => {
        this.message = ""
      })
      .finally(() => {
        this.chatHistory.push(this.llamaMessage)
        this.llamaMessage = ""
        this.scrollToBottom()
        this.working = false
      })
  }

  scrollToBottom(): void {
    const container = this.scrollContainer.nativeElement;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    });
  }
}
