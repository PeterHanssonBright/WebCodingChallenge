import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IThumbnail } from 'src/app/interfaces/thumbnail';
import { IUser } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = 'https://jsonplaceholder.typicode.com';

  constructor(
    private http: HttpClient
  ) { }

  getThumbnailUrl(length: number): Observable<IThumbnail> {
    return this.http.get<IThumbnail>(`${this.api}/photos/${length}`);
  }

  addUser(user: IUser): Observable<any> {
    return this.http.post(`${this.api}/users`, {user});
  }
}
