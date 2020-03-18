import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AutentificacionService {

  url_api = "http://ec2-52-14-24-70.us-east-2.compute.amazonaws.com:3000";

  constructor(private httpClient: HttpClient) { }

  getUsers(){
    const url = `${this.url_api}/getUsers`;
    this.httpClient
      .get(url)
      .subscribe(Data => console.log(Data));
  }

  login(username, password){
    const data = {username, password}
    const url = `${this.url_api}/login`;
    return new Promise(resolve => {
      this.httpClient.post(url,data)
      .subscribe(resp => {
        resolve(resp["auth"]);
      });
    });
  }

  register(username, password, photo){
    //const data = {username, password}
    var formData: any = new FormData();
    formData.append("photo", photo);
    formData.append("username", username);
    formData.append("password", password);
    console.log("datos:",formData);

    const url = `${this.url_api}/register`;
    return new Promise(resolve => {
      this.httpClient.post(url,formData)
      .subscribe(resp => {
        resolve(resp["register"]);
      });
    });
  }

}
