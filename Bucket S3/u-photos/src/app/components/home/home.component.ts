import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { User } from 'src/app/models/user.model';
import { LambdasService } from 'src/app/servicios/lambdas.service';
import { AutentificacionService } from 'src/app/servicios/autentificacion.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username = 'desconocido';
  public imagePath;
  imgURL: any;
  public message: string;

  constructor(private userService: UsuarioService,
              public authService: AutentificacionService) { }

  ngOnInit(): void {
    this.username = (<User>this.userService.getUserLoggedIn()).username;
  }

  loadPhoto(files){
    if (files.length === 0)
        return;

      var mimeType = files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        this.message = "Only images are supported.";
        return;
      }

      var reader = new FileReader();
      this.imagePath = files;
      reader.readAsDataURL(files[0]); 
      reader.onload = (_event) => { 
        this.imgURL = reader.result; 
        this.enviarFoto();
        console.log(this.imgURL);
      }
  }

  async enviarFoto(){
    var bytes = this.imgURL.split(',')[0].indexOf('base64') >= 0 ?
    atob(this.imgURL.split(',')[1]) :
    (<any>window).unescape(this.imgURL.split(',')[1]);

    var mime = this.imgURL.split(',')[0].split(':')[1].split(';')[0];
    var max = bytes.length;
    var ia = new Uint8Array(max);
    for (var i = 0; i < max; i++) {
    ia[i] = bytes.charCodeAt(i);
    }

    var file = new File([ia], 'image.jpg', { type: mime });
    const datos = await this.authService.load_photo(file,this.username);
    console.log(datos);

    if(datos["loadImage"]){
      alert(datos["informacion"]);
    }
    else{
      alert("La foto no se ha podido cargar correctamente");
    }

  }

}
