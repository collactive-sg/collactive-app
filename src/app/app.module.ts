import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth"; 
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './index/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandingComponent } from './index/landing/landing.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ProfileSetupModule } from './profile-setup/profile-setup.module';
import { SharedModule } from './shared/shared.module';
import { IndexModule } from './index/index.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileSettingsComponent } from './home/profile-settings/profile-settings.component';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HomeModule } from './home/home.module';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    HomeModule,
    SharedModule,
    MarketplaceModule,
    IndexModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
