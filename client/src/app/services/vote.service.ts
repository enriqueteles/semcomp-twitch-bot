import { Observable } from 'rxjs';
import * as socketIo from 'socket.io-client';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as connection from '../../connection';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  private clientSocket: socketIo.Socket;
  private endpoint = `${environment.API}`;

  constructor(
    private http: HttpClient
  ) {
    this.clientSocket = socketIo.io('http://localhost:3333');
  }

  listenToServer(connection) : Observable<any> {
    return new Observable( (subscribe) => {
      this.clientSocket.on(connection, (data) => {
        subscribe.next(data);
      })
    })
  }

  emitToServer(connection, data) : void {
    this.clientSocket.emit(connection, data);
  }

  getResults(): Observable<any> {
    return this.http.get(this.endpoint);
  }

  reset(): Observable<any> {
    return this.http.get(`${this.endpoint}/reset`);
  }

  public addImage(title: String, file: File) {
    // save database
    const endpoint = `${environment.API}/changeImage/${title}`;
    const formData: FormData = new FormData();
    formData.append('file', file);

    this.http.post(endpoint, formData)
      .subscribe({
        next: (res: any) => {
          return true;
        },
        error: err => {
          console.log(err);
        }
      })
  }
}
