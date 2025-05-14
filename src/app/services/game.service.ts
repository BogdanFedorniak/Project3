import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface Gem {
  type: string;
}

interface Move {
  from: { row: number, col: number };
  to: { row: number, col: number };
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://localhost:3000';
  private isPausedSubject = new BehaviorSubject<boolean>(false);
  private boardSubject = new BehaviorSubject<(Gem | null)[][]>([]);

  constructor(private http: HttpClient) {}

  getBoardState(): Observable<(Gem | null)[][]> {
    return this.http.get<(Gem | null)[][]>(`${this.apiUrl}/board`).pipe(
      catchError(this.handleError)
    );
  }

  getBoard(): Observable<(Gem | null)[][]> {
    return this.boardSubject.asObservable();
  }

  makeMove(move: Move): Observable<(Gem | null)[][]> {
    return this.http.post<(Gem | null)[][]>(`${this.apiUrl}/moves`, move).pipe(
      tap(updatedBoard => this.boardSubject.next(updatedBoard)),
      catchError(this.handleError)
    );
  }

  pauseGame() {
    this.isPausedSubject.next(true);
  }

  restartGame() {
    this.isPausedSubject.next(false);
    this.http.post<void>(`${this.apiUrl}/board/reset`, {}).pipe(
      catchError(this.handleError)
    ).subscribe(() => {
      this.getBoardState().subscribe(board => this.boardSubject.next(board));
    });
  }

  getPausedState(): Observable<boolean> {
    return this.isPausedSubject.asObservable();
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Помилка:', error.message);
    return throwError(() => new Error('Щось пішло не так; спробуйте ще раз.'));
  }
}
