import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { User } from './model/user';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class UserService {
  private url = 'http://127.0.0.1:8000/api';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http){}

  login(user: User): Promise<any> {
    return this.http
      .post(this.url + '/login', JSON.stringify(user), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  guest(): Promise<any> {
    return this.http
      .post(this.url + '/guest', {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
