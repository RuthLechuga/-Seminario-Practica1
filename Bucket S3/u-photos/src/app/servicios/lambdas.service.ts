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

  getMyPhotos(username){
    const data = {username}
    const url = `${this.url_api}/myphotos`;
    return new Promise(resolve => {
      this.httpClient.post(url,data)
      .subscribe(resp => {
        console.log(resp);
        resolve(resp);
      });
    });
  }

  getPhotosCategory(username){
    const data = {username}
    const url = `${this.url_api}/getphotoscategory`;
    return new Promise(resolve => {
      this.httpClient.post(url,data)
      .subscribe(resp => {
        console.log(resp);
        resolve(resp);
      });
    });
  }
}
