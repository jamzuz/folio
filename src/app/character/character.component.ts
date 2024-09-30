import { KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [NgFor, NgIf, KeyValuePipe, ReactiveFormsModule],
  templateUrl: './character.component.html',
  styleUrl: './character.component.css'
})
export class CharacterComponent implements OnInit {

  races = ['Human', 'Elf', 'Dwarf', 'Orc', 'Halfling', 'Dragonborn', 'Tiefling', 'Gnome'];
  classes = ['Warrior', 'Mage', 'Rogue', 'Cleric', 'Paladin', 'Ranger', 'Bard', 'Monk'];
  points_left = 27
  points_max = 27
  hero = {
    race: this.races[0],
    name: "John Smith",
    class: this.classes[0],
    stats: {
      strength: 8,
      dexterity: 8,
      constitution: 8,
      intelligence: 8,
      wisdom: 8,
      charisma: 8
    }
  }
  finished: boolean = false
  point_buy_rules: { [key: string]: number } = {
    "8": 1,
    "9": 1,
    "10": 1,
    "11": 1,
    "12": 1,
    "13": 2,
    "14": 2,
    "15": 2
  }
  player: FormGroup

  constructor() {
    this.player = new FormGroup({
      race: new FormControl(this.races[0]),
      name: new FormControl(this.hero.name),
      class: new FormControl(this.classes[0]),
      strength: new FormControl(this.hero.stats.strength, [Validators.min(8), Validators.max(18)]),
      dexterity: new FormControl(this.hero.stats.dexterity, [Validators.min(8), Validators.max(18)]),
      constitution: new FormControl(this.hero.stats.constitution, [Validators.min(8), Validators.max(18)]),
      intelligence: new FormControl(this.hero.stats.intelligence, [Validators.min(8), Validators.max(18)]),
      wisdom: new FormControl(this.hero.stats.wisdom, [Validators.min(8), Validators.max(18)]),
      charisma: new FormControl(this.hero.stats.charisma, [Validators.min(8), Validators.max(18)])
    })
  }

  ngOnInit(): void {

    if (localStorage.getItem('player_stats')) {
      this.player.setValue(JSON.parse(localStorage.getItem('player_stats')!))
      this.finished = true
      this.player.disable()
    }
  }

  incrementNumber(key: string) {
    const control = this.player.get(key);
    if (control && this.points_left >= 0) {
      const currentValue: number = control.value;
      if (this.points_left - this.point_buy_rules[currentValue] >= 0 && currentValue < 15) {
        this.points_left -= this.point_buy_rules[currentValue]
        const newValue = Math.min(currentValue + 1, 15);
        control.setValue(newValue);
      } else if (this.points_left - this.point_buy_rules[currentValue] >= 0) {
        alert("not enough points or maximum reached")
      } else {
        alert("woops")
      }
    }
  }

  decrementNumber(key: string) {
    const control = this.player.get(key);
    if (control) {
      const currentValue = control.value;
      const newValue = Math.max(currentValue - 1, 8);
      control.setValue(newValue);
      if (currentValue != newValue) {
        this.points_left += this.point_buy_rules[newValue]
      }
    }
  }

  isThereEnoughpoints(key: string): boolean {
    const control = this.player.get(key);
    if (control && this.points_left >= 0) {
      const currentValue = control.value;
      if (this.points_left - this.point_buy_rules[currentValue] >= 0 && currentValue < 15) {
        return false
      } else {
        return true
      }
    }
    return false
  }

  onSubmit() {
    localStorage.setItem(
      'player_stats',
      JSON.stringify(this.player.value)
    );
    this.player.disable()
    this.finished = true
  }
  calcModifier(val: number) {
    const mod = Math.floor((val - 10) / 2);
    return mod > 0 ? "+" + mod : mod.toString();
  }
}
