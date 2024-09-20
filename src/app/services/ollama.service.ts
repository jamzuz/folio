import { Injectable } from '@angular/core';
import { Ollama } from 'ollama';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OllamaService {
  llamaChat = new BehaviorSubject<string>('');
  ollama = new Ollama({ host: 'http://localhost:11434' });

  assistantMessages: Array<{ role: string; content: string }> = [];

  assistantInstructions: string = `You are a virtual Dungeon Master for this user. Guide the player through this journey. Remember to start with setting up the character and asking what kind of campaign would they like to play. Make sure there is some sort of combat involved and also enough roleplaying and adventuring. Dont confuse the player by giving them many questions at once, when possible ask one thing at a time! Do not answer or react to non-game related questions and steer the user back to the game if they try to talk about other things! If you want part of your output bolded or emphasized wrap it in <b> </b> tags. Here comes the players first message: `

  constructor() {
    const context = this.getFromLocalStorage();
    this.assistantMessages = context;
  }

  async talkToLlama(message: string) {
    const assistantMessage = { role: 'assistant', content: "" }
    if (!this.assistantMessages.length) {
      this.assistantMessages.push({ role: 'user', content: this.assistantInstructions + message });
    } else {
      this.assistantMessages.push({ role: 'user', content: message });
    }
    const response = await this.ollama.chat({
      model: 'llama3.1',
      stream: true,
      messages: this.assistantMessages,
    });
    for await (const part of response) {
      const s = part.message.content
      s.replaceAll("\n", "<br>")
      this.llamaChat.next(s);
      assistantMessage.content = assistantMessage.content + s
    }
    this.assistantMessages.push(assistantMessage);
    this.pushToLocalStorage();
    this.llamaChat.next('');
  }

  getLlamaChat(): Observable<string> {
    return this.llamaChat.asObservable();
  }

  pushToLocalStorage() {
    localStorage.setItem(
      'ollamaContext',
      JSON.stringify(this.assistantMessages)
    );
  }

  getMessages() {
    const messages = this.assistantMessages.map(message => message.content)
    messages[0] = messages[0].split(":")[1]
    messages.forEach(x=> {
      x.replaceAll("\n", "<br>")
      x.replaceAll("\n\n", "<br>")
    })
    messages[messages.length-1] = messages[messages.length-1] + " <br> ... end of chatlog ... <br>" 
    return messages
  }

  getFromLocalStorage() {
    const context = localStorage.getItem('ollamaContext');
    return context ? JSON.parse(context) : [];
  }
}
