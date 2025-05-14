import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

const CLOTHING_TYPES = ['tshirt', 'pants', 'sneakers', 'hoodie', 'jacket'];
const BOARD_SIZE = 8;

interface Gem {
  type: string;
  matched?: boolean;
}

interface Position {
  row: number;
  col: number;
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  board: Gem[][] = [];
  @Output() scoreUpdate = new EventEmitter<number>();
  private score: number = 0;
  private selectedGem: Position | null = null;
  private imageUrls: { [key: string]: string } = {};

  ngOnInit() {
    this.loadImages();
    this.initializeBoard();
    this.removeInitialMatches();
  }

  loadImages() {
    const imagePaths: { [key: string]: string } = {
      tshirt: 'assets/images/tshirt_game.png',
      pants: 'assets/images/pants_game.png',
      sneakers: 'assets/images/sneakers_game.png',
      hoodie: 'assets/images/hoodie_game.png',
      jacket: 'assets/images/jacket_game.png'
    };
    const placeholder = 'assets/images/placeholder.png'; // Резервне зображення

    Object.keys(imagePaths).forEach(type => {
      const path = imagePaths[type];
      const img = new Image();
      img.onload = () => {
        this.imageUrls[type] = path;
        console.log(`Verified image for ${type}: ${path}`);
      };
      img.onerror = () => {
        console.error(`Failed to load image for ${type} at ${path}`);
        this.imageUrls[type] = placeholder; // Використовуємо placeholder у разі помилки
      };
      img.src = path;
    });
  }

  initializeBoard() {
    this.board = Array(BOARD_SIZE).fill(null).map(() =>
      Array(BOARD_SIZE).fill(null).map(() => ({
        type: CLOTHING_TYPES[Math.floor(Math.random() * CLOTHING_TYPES.length)],
        matched: false
      }))
    );
  }

  removeInitialMatches() {
    let hasMatches = true;
    while (hasMatches) {
      hasMatches = false;
      const matches = this.findMatches();
      if (matches.length > 0) {
        hasMatches = true;
        matches.forEach(({ row, col }) => {
          this.board[row][col] = {
            type: CLOTHING_TYPES[Math.floor(Math.random() * CLOTHING_TYPES.length)],
            matched: false
          };
        });
      }
    }
  }

  selectGem(row: number, col: number) {
    if (!this.board[row][col]) return;

    if (!this.selectedGem) {
      this.selectedGem = { row, col };
      return;
    }

    const firstGem = this.selectedGem;
    const secondGem = { row, col };

    const isAdjacent = Math.abs(firstGem.row - secondGem.row) + Math.abs(firstGem.col - secondGem.col) === 1;
    if (!isAdjacent) {
      this.selectedGem = { row, col };
      return;
    }

    this.swapGems(firstGem, secondGem);
    this.selectedGem = null;

    const matchesBefore = this.findMatches();
    this.handleMatches();
    const matchesAfter = this.findMatches();
    if (matchesAfter.length === 0 && matchesBefore.length === 0) {
      this.swapGems(firstGem, secondGem); // Відкат, якщо немає комбінацій
    }
  }

  swapGems(pos1: Position, pos2: Position) {
    const temp = this.board[pos1.row][pos1.col];
    this.board[pos1.row][pos1.col] = this.board[pos2.row][pos2.col];
    this.board[pos2.row][pos2.col] = temp;
  }

  findMatches(): { row: number; col: number }[] {
    const matches: { row: number; col: number }[] = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE - 2; col++) {
        if (
          this.board[row][col]?.type === this.board[row][col + 1]?.type &&
          this.board[row][col]?.type === this.board[row][col + 2]?.type
        ) {
          matches.push({ row, col }, { row, col: col + 1 }, { row, col: col + 2 });
        }
      }
    }

    for (let col = 0; col < BOARD_SIZE; col++) {
      for (let row = 0; row < BOARD_SIZE - 2; row++) {
        if (
          this.board[row][col]?.type === this.board[row + 1][col]?.type &&
          this.board[row][col]?.type === this.board[row + 2][col]?.type
        ) {
          matches.push({ row, col }, { row: row + 1, col }, { row: row + 2, col });
        }
      }
    }

    return [...new Set(matches.map(m => JSON.stringify(m)))].map(m => JSON.parse(m));
  }

  async handleMatches() {
    let matchesFound = true;

    while (matchesFound) {
      const matches = this.findMatches();
      if (matches.length === 0) {
        matchesFound = false;
        break;
      }

      matches.forEach(({ row, col }) => {
        if (this.board[row][col]) this.board[row][col].matched = true;
      });

      this.score += matches.length * 10;
      this.scoreUpdate.emit(this.score);

      await new Promise(resolve => setTimeout(resolve, 300));

      for (const { row, col } of matches) {
        this.board[row][col] = null as any;
      }

      for (let col = 0; col < BOARD_SIZE; col++) {
        let emptySpaces = 0;
        for (let row = BOARD_SIZE - 1; row >= 0; row--) {
          if (!this.board[row][col]) {
            emptySpaces++;
          } else if (emptySpaces > 0) {
            this.board[row + emptySpaces][col] = this.board[row][col];
            this.board[row][col] = null as any;
          }
        }
        for (let row = 0; row < emptySpaces; row++) {
          this.board[row][col] = {
            type: CLOTHING_TYPES[Math.floor(Math.random() * CLOTHING_TYPES.length)],
            matched: false
          };
        }
      }

      this.board.forEach(row => row.forEach(gem => gem && (gem.matched = false)));
    }
  }

  restart() {
    this.score = 0;
    this.scoreUpdate.emit(this.score);
    this.selectedGem = null;
    this.initializeBoard();
    this.removeInitialMatches();
  }

  isSelected(row: number, col: number): boolean {
    return this.selectedGem?.row === row && this.selectedGem?.col === col;
  }

  getGemClass(type: string): string {
    return type.toLowerCase();
  }

  getClothingImage(type: string): string {
    return this.imageUrls[type.toLowerCase()] || 'assets/images/placeholder.png';
  }

  onImageError(event: Event, type: string) {
    console.error(`Failed to display image for ${type}: ${this.getClothingImage(type)}`);
    this.imageUrls[type.toLowerCase()] = 'assets/images/placeholder.png'; // Використовуємо placeholder при помилці
  }
}
