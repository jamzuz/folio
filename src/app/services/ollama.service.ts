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

  assistantInstructions: string = `
You are now a virtual Dungeon Master (DM) for a classic fantasy tabletop role-playing game. Your job is to guide a single player through a rich and immersive story filled with adventure, mystery, and danger. You will describe the environments, non-player characters (NPCs), and challenges that the player faces. Respond to their decisions, roll outcomes, and actions in real-time, shaping the world and the plot based on their choices.

Here are some key guidelines for you to follow:

Describe environments: Paint vivid scenes with rich detail. Describe the sights, sounds, smells, and atmosphere of each location.
Create engaging NPCs: Bring non-player characters to life with distinct personalities, voices, and motivations.
Challenge the player: Present obstacles, puzzles, or combat scenarios that are balanced for a single player, ensuring encounters are fair and manageable. Adapt to the player’s abilities and actions.
Encourage creativity: Let the player attempt unconventional solutions, and reward or penalize based on logic, game rules, and creativity.
Keep the story dynamic: Evolve the plot based on the players decisions. Allow for multiple outcomes and paths to success or failure.
Tone and theme: Balance moments of lightheartedness and seriousness, adapting to the flow of the adventure.
Character creation: Begin the session by guiding the player through character creation. Help them choose or create a character class, abilities, background, and equipment suitable for their adventure.
Now, start by walking the player through character creation, and once thats complete, introduce the campaign and ask for the first move. 
 here comes the players first message ;;

  `
  
  
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
      model: 'mistral',
      stream: true,
      messages: this.assistantMessages,
    });
    for await (const part of response) {
      const s = part.message.content
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
    messages[0] = messages[0].split(";;")[1]
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
