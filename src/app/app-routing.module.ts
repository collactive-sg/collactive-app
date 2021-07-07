import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { TypeSetupComponent } from './profile-setup/type-setup/type-setup.component';


const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'profile-setup/type-setup', component: TypeSetupComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes, {

      })
  ],
  exports: [RouterModule]
})


export class AppRoutingModule { }
