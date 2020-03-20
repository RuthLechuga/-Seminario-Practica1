import { Component, OnInit } from '@angular/core';
import { LambdasService } from 'src/app/servicios/lambdas.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-home-fotos',
  templateUrl: './home-fotos.component.html',
  styleUrls: ['./home-fotos.component.css']
})
export class HomeFotosComponent implements OnInit {

  photos;
  username = null;

  constructor(public lambdaService: LambdasService,
              private userService: UsuarioService) { }

  ngOnInit(): void {
    this.username = (<User>this.userService.getUserLoggedIn()).username;
    if(this.username != null) {
      this.getPhotos();
    }
  }

  async getPhotos(){
    let temporal = await this.lambdaService.getAllPhotos(this.username);
    this.photos = (<any>temporal).body.Items;
    console.log(this.photos);
  }

}
