import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpParams } from '@angular/common/http';
import { FileData } from './model/fileData';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class ShowService {
  private url = 'http://127.0.0.1:8000/api/babyshow';

  getHeaders(): Headers {
    return new Headers({ 'Authorization': 'Bearer '+localStorage.getItem('token') });
  }

  constructor(private http: Http){}

  add(file: File, comment: string, date: Date, isPrivate = false): Promise<any> {
    let body = new FormData();
    body.append('files', file);
    body.append('file_comment', comment? comment: '');
    body.append('file_date', date.toString());
    body.append('is_private', isPrivate.toString());
    return this.http
    .post(this.url + '/upload', body, {headers: this.getHeaders()})
    .toPromise()
    .then(res => {
      let msg = res.json();
      localStorage.setItem('token', msg.token);
      if(msg.code === 200){
        msg.data.id = msg.data._id;
        msg.data.file_name = 'http://127.0.0.1:8000/babyshow/' + msg.data.file_name;
        msg.data.file_date = new Date(msg.data.file_date);
      }
      return msg;
    })
    .catch(this.handleError);
  }

  edit(fileData: FileData): Promise<any> {
    return this.http
    .put(this.url+'/show/'+fileData.id, fileData, {headers: this.getHeaders()})
    .toPromise()
    .then(res => res.json())
    .catch(this.handleError)
  }

  delete(id: number): Promise<any> {
    return this.http
    .delete(this.url+'/show/'+id, {headers: this.getHeaders()})
    .toPromise()
    .then(res => res.json())
    .catch(this.handleError)
  }

  getList(): Promise<FileData[]> {
    return this.http
    .get(this.url, { headers: this.getHeaders(), params: {'date': sessionStorage.getItem('date')} })
    .toPromise()
    .then(res => {
      var msg = res.json();
      localStorage.setItem('token', msg.token);

      if(msg.code == 200){
        var list = [];
        for(let item  of msg.data){
          item.id = item._id;
          item.file_name = 'http://127.0.0.1:8000/babyshow/' + item.file_name;
          item.file_date = new Date(item.file_date);
          list.push(item)
        }
        return list as FileData[];
      }else{
        return [];
      }
    })
    .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
