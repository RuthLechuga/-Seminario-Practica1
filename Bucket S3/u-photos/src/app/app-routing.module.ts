import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { HomeFotosComponent } from './components/home-fotos/home-fotos.component';
import { HomeAlbumsComponent } from './components/home-albums/home-albums.component';
import { HomeMisFotosComponent } from './components/home-mis-fotos/home-mis-fotos.component';

const routes: Routes = [
  { path: '', 
    component: LoginComponent 
  },
  { 
    path: 'home', 
    component: HomeComponent,
    children: [
      {path: 'fotos', component: HomeFotosComponent},
      {path: 'albums', component: HomeAlbumsComponent},
      {path: 'misFotos', component: HomeMisFotosComponent}
    ] 
  },
  {
    path: 'home/fotos',
    component: HomeFotosComponent
  },
  {
    path: 'home/albums',
    component: HomeAlbumsComponent
  },
  {
    path: 'home/misFotos',
    component: HomeMisFotosComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
