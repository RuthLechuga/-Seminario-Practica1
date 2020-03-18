import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { AutentificacionService } from 'src/app/servicios/autentificacion.service';
import { Router } from '@angular/router';

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
              private renderer: Renderer2) { }
    
  ngOnInit(): void {
    this.startCamera();
  }

  //-------------------------------------------------OBTENER DATOS-------------------------------------------//
  onKeyPassLogin(event){
    this.password = event.target.value;
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
      this.router.navigate(['/','home/fotos']);  
    }
    else
    {
      alert("Datos ingresados incorrectos!");
    }
  }

  async register(){
    var bytes = this.url_photo.split(',')[0].indexOf('base64') >= 0 ?
          atob(this.url_photo.split(',')[1]) :
          (<any>window).unescape(this.url_photo.split(',')[1]);
    var mime = this.url_photo.split(',')[0].split(':')[1].split(';')[0];
    var max = bytes.length;
    var ia = new Uint8Array(max);
    for (var i = 0; i < max; i++) {
      ia[i] = bytes.charCodeAt(i);
    }

    var file = new File([ia], this.user_register+'.jpg', { type: mime });
    const bandera = await this.authService.register(this.user_register,this.password_register,file);
    
    if(bandera){
      alert("Registro realizado de forma exitosa.")
      this.router.navigate(['/','home/fotos']);  
    }
    else
    {
      alert("Datos ingresados incorrectos!");
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

    var file = new File([ia], 'image.jpg', { type: mime });
    const bandera = await this.authService.login_photo(file);

    if(bandera){
      this.router.navigate(['/','home']);  
    }
    else{
      alert("Datos ingresados incorrectos!");
    }
  }

  async captureRegister(){
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoRegister.nativeElement, 0, 0);
    this.url_photo = this.canvas.nativeElement.toDataURL("image/png");
    console.log(this.url_photo);
  }

}
