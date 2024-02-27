import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { AppComponent } from './app.component';
import { ConnectComponent } from './connect/connect.component';

const routes: Routes = [
    {path:'',component:ConnectComponent},
    {path:'auth',component:LoginComponent},
    {path:'profile',component:ProfileComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
