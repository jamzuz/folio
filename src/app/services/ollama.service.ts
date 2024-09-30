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
  You are a virtual Dungeon Master for this user.
  You will only ask one thing at a time before moving on to next thing.
  Remember to start with setting up the character;
  First ask the player their character name.
  Second ask the player what kind of race they would like to be.
  Third ask what class are they playing.
  after all this is come up with a high-fantasy custom homebrew campaign of your own creation with a random name, setting and world (not eldoria).
  incorporate various rolls and remember to keep everything turn based.
  Make sure there is some sort of combat involved and also enough roleplaying and adventuring.
  There is only one player in this campaign.
  Do not answer or react to non-game related questions and steer the user back to the game if they try to talk about other things!
  If you want part of your output bolded or emphasized wrap it in <b> </b> tags.
  Make sure every action the player takes is allowed in the current scope of the game.
  Please remember that player has specific abilities, strengths, and weaknesses as described in character stats. These limitations should be adhered to during our adventure encounters and roleplaying opportunities.
  Here comes the players first message: `;

  constructor() {
    const context = this.getFromLocalStorage();
    this.assistantMessages = context;
  }

  async talkToLlama(message: string) {
    const assistantMessage = { role: 'assistant', content: '' };
    if (!this.assistantMessages.length) {
      this.assistantMessages.push({
        role: 'user',
        content: this.assistantInstructions + localStorage.getItem('player_stats'),
      });
    } else {
      this.assistantMessages.push({ role: 'user', content: message });
    }
    const response = await this.ollama.chat({
      model: 'mistral',
      stream: true,
      messages: this.assistantMessages,
    });
    for await (const part of response) {
      const s = part.message.content;
      s.replaceAll('\n', '<br>');
      this.llamaChat.next(s);
      assistantMessage.content = assistantMessage.content + s;
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
    const messages = this.assistantMessages.map((message) => message.content);
    console.log(messages);
    if (!messages.length) return [];
    messages[0] = messages[0].split(':')[1];
    messages[messages.length - 1] =
      messages[messages.length - 1] + ' <br> ... end of chatlog ... <br>';
    return messages;
  }

  getFromLocalStorage() {
    const context = localStorage.getItem('ollamaContext');
    return context ? JSON.parse(context) : [];
  }

  clearLocalStorage() {
    const context = localStorage.getItem('ollamaContext');
    const char = localStorage.getItem('player_stats')
    if (context || char) {
      localStorage.clear();
      location.reload();
    }
  }

  async generateImagePrompt(prompt: string) {
    const instructions = `
  You are a master photographer who perfectly captures scenes to few sentences

  Here is a imaginary scenery that you summarize:
  Scene:
  "
  ${prompt}
  "

  Scene ends.

Use the scenery to create text description for image generation. The description should be one sentence.`;
    const response = await this.ollama.generate({
      model: 'mistral',
      prompt: instructions,
    });
    return response.response;
  }

}