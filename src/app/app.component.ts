import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Game } from '../game';
import { TitleScreen } from '../titleScreen';

@Component({
  selector: 'app-root',
  template: `
    <button id="fullscreenButton" (click)="toggleFullscreen()">Fullscreen</button>
    <canvas #gameCanvas id="gameCanvas"></canvas>
  `
})
export class AppComponent implements OnInit {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private game: Game | null = null;
  private titleScreen: TitleScreen | null = null;

  ngOnInit() {
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d')!;
    this.titleScreen = new TitleScreen(canvas, context, () => this.startGame());
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.showTitleScreen();
  }

  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (this.game) {
      this.game.resizeCanvas();
    }
  }

  private showTitleScreen() {
    this.titleScreen?.show();
  }

  private startGame() {
    this.game = new Game('gameCanvas', this.titleScreen!);
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
