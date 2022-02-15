import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth"; 
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ProfileSetupModule } from './profile-setup/profile-setup.module';
import { SharedModule } from './shared/shared.module';
import { IndexModule } from './index/index.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { HomeModule } from './home/home.module';
import { ChatModule } from './chat/chat.module';
import { HttpClientModule } from '@angular/common/http';
// import { HttpModule } from '@angular/http';
import { HttpClientJsonpModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    HomeModule,
    SharedModule,
    MarketplaceModule,
    ChatModule,
    ProfileSetupModule,
    IndexModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
