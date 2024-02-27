import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';

import { ButtonModule } from 'primeng/button';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { ConnectComponent } from './connect/connect.component';
import { LineService } from './core/services/line.service';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';

const primeng = [
  ButtonModule,
  CardModule,
  InputTextModule,
  ToastModule
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    ConnectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ...primeng
  ],
  providers: [LineService,MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
