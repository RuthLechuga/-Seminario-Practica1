import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { LambdasService } from 'src/app/servicios/lambdas.service';
import { User } from 'src/app/models/user.model';
import { fotos_categoria } from 'src/app/models/categoria_imagen.model';

@Component({
  selector: 'app-home-albums',
  templateUrl: './home-albums.component.html',
  styleUrls: ['./home-albums.component.css']
})
export class HomeAlbumsComponent implements OnInit {

  photos: fotos_categoria[] = [];
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
    let temporal = await this.lambdaService.getPhotosCategory(this.username);

    (<any>temporal).Imagenes.forEach(element => {
      let bandera = false;

      for(let i=0;i<this.photos.length;i++){
        if(this.photos[i].nombre.localeCompare(element.categoria)==0 && !bandera){
          this.photos[i].urls.push(element.imagen);
          bandera = true;
          break;
        }
      }
      
      if(!bandera){
        let nueva_categoria: fotos_categoria = new fotos_categoria();
        nueva_categoria.nombre = element.categoria;
        nueva_categoria.urls.push(element.imagen);
        this.photos.push(nueva_categoria);
      }

    });

    //this.photos = (<any>temporal).body.Items;
    console.log(this.photos);
  }

}
