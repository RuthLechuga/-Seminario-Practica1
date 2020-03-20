import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LambdasService {

  url_api = "https://icte93wln9.execute-api.us-east-2.amazonaws.com/Pruebas";

  constructor(private httpClient: HttpClient) { }

  getAllPhotos(username){
    const data = {username}
    const url = `${this.url_api}/getallphotos`;
    return new Promise(resolve => {
      this.httpClient.post(url,data)
      .subscribe(resp => {
        resolve(resp);
      });
    });
  }
}
