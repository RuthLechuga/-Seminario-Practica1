import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { AutentificacionService } from 'src/app/servicios/autentificacion.service';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { User } from '../../models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username:string = '';
  password:string = '';

  user_register: string = '';
  password_register: string = '';

  videoWidth = 0;
  videoHeight = 0;

  url_photo: string = '';

  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  @ViewChild('videoRegister', { static: true }) videoRegister: ElementRef;

  constraints = {
    video: {
        facingMode: "environment",
        width: { ideal: 4096 },
        height: { ideal: 2160 }
    }
  };

  constructor(public authService: AutentificacionService,
              private router: Router,
              private renderer: Renderer2,
              private userService: UsuarioService) { }
    
  ngOnInit(): void {
    this.startCamera();
  }

  //-------------------------------------------------OBTENER DATOS-------------------------------------------//
  onKeyPassLogin(event){
    this.password = event.target.value;
    console.log(this.password);
  }

  onKeyUserLogin(event){
    this.username = event.target.value;
  }

  onKeyUserRegister(event){
    this.user_register = event.target.value;
  }

  onKeyPasswordRegister(event){
    this.password_register = event.target.value;
  }

  //---------------------------------------------------FUNCIONES---------------------------------------------//
  async login(){
    const bandera = await this.authService.login(this.username,this.password);
    console.log(bandera);

    if(bandera){
      let u: User = {username: this.username};        
      this.userService.setUserLoggedIn(u);
      this.router.navigate(['/','home']);  
    }
    else
    {
      alert("Datos ingresados incorrectos!");
    }
  }

  async register(){
    if(this.url_photo != "" && this.user_register!= "" && this.password_register!=""){
      var bytes = this.url_photo.split(',')[0].indexOf('base64') >= 0 ?
      atob(this.url_photo.split(',')[1]) :
      (<any>window).unescape(this.url_photo.split(',')[1]);
      var mime = this.url_photo.split(',')[0].split(':')[1].split(';')[0];
      var max = bytes.length;
      var ia = new Uint8Array(max);
      for (var i = 0; i < max; i++) {
        ia[i] = bytes.charCodeAt(i);
      }

      Swal.fire({
        title: '¿Quieres registrarte con estos datos?',
        text: "Username: "+this.user_register,
        imageUrl: this.url_photo,
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',    
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Loguin'
      }).then((result) => {
        if (result.value) {
          Swal.fire({title: "Espera mientras procesamos la información...", text: "Puede tardar algunos segundos"});
          this.register_photo(ia,mime);
        }
      })
    }
    else if(this.user_register!= "" && this.password_register!=""){
      Swal.fire({
        title: '¿Quieres registrarte con estos datos?',
        text: "Username: "+this.user_register,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Loguin'
      }).then((result) => {
        if (result.value) {
          Swal.fire({title: "Espera mientras procesamos la información...", text: "Puede tardar algunos segundos"});
          this.register_nophoto();
        }
      })
    }

    else
      Swal.fire("Datos insuficientes para registrarse!");
  }

  async register_photo(ia,mime){
    var file = new File([ia], this.user_register+'.jpg', { type: mime });
    const bandera = await this.authService.register(this.user_register,this.password_register,file);

    if(bandera){
      Swal.fire("Registro realizado de forma exitosa.")
      let u: User = {username: this.user_register};        
      this.userService.setUserLoggedIn(u);
      this.router.navigate(['/','home']);  
    }
    else
    {
      Swal.fire("Datos ingresados incorrectos!");
    }
  }

  async register_nophoto(){
    const bandera = await this.authService.register_nophoto(this.user_register,this.password_register);

    if(bandera){
      Swal.fire("Registro realizado de forma exitosa.")
      let u: User = {username: this.user_register};        
      this.userService.setUserLoggedIn(u);
      this.router.navigate(['/','home']);  
    }
    else
    {
      Swal.fire("Datos ingresados incorrectos!");
    }
  }


  //---------------------------------------------------CAMARA---------------------------------------------//
  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) { 
      navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
      navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideoRegister.bind(this)).catch(this.handleError);
    
    } else {
      alert('Sorry, camera not available.');
    }
  }

  handleError(error) {
    console.log('Error: ', error);
  }

  attachVideo(stream) {
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
        this.videoHeight = this.videoElement.nativeElement.videoHeight;
        this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
  }

  attachVideoRegister(stream){
    this.renderer.setProperty(this.videoRegister.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoRegister.nativeElement, 'play', (event) => {
        this.videoHeight = this.videoRegister.nativeElement.videoHeight;
        this.videoWidth = this.videoRegister.nativeElement.videoWidth;
    });
  }

  //loguearse por camara
  async capture(){
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
    this.url_photo = this.canvas.nativeElement.toDataURL("image/png");
    console.log(this.url_photo);

    var bytes = this.url_photo.split(',')[0].indexOf('base64') >= 0 ?
          atob(this.url_photo.split(',')[1]) :
          (<any>window).unescape(this.url_photo.split(',')[1]);
    
    var mime = this.url_photo.split(',')[0].split(':')[1].split(';')[0];
    var max = bytes.length;
    var ia = new Uint8Array(max);
    for (var i = 0; i < max; i++) {
      ia[i] = bytes.charCodeAt(i);
    }

    Swal.fire({
      title: '¿Quieres loguarte con esta imagen?',
      imageUrl: this.url_photo,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Custom image',    
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Loguin'
    }).then((result) => {
      if (result.value) {
        Swal.fire({title: "Espera mientras procesamos la información...", text: "Puede tardar algunos segundos"});
        this.login_image(ia,mime);
      }
    })
  }

  async login_image(ia,mime){
    var file = new File([ia], 'image.jpg', { type: mime });
    const datos = await this.authService.login_photo(file);
    console.log(datos);

    if(datos["auth"]){
      let u: User = {username: datos["username"]};        
      this.userService.setUserLoggedIn(u);
      this.router.navigate(['/','home']);  
    }
    else{
      Swal.fire("Datos ingresados incorrectos!");
    }
  }

  async captureRegister(){
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoRegister.nativeElement, 0, 0);
    this.url_photo = this.canvas.nativeElement.toDataURL("image/png");
    console.log(this.url_photo);

    Swal.fire({
      title: 'Foto almacenada',
      imageUrl: this.url_photo,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Custom image',    
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar'
    });
  }

}
