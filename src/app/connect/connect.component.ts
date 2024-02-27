import { Component } from '@angular/core';

import { FormBuilder } from '@angular/forms';
import { LineService } from '../core/services/line.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css']
})

export class ConnectComponent {

  formConnect = this.fb.group({
    channelId:"2003563877",
    channelSecretId:"d0480c4a70b1040048d9a9c21bc9e999"
  })
  lineConnect$ = this.line.lineConnect$
  
  constructor(
    private fb:FormBuilder,
    private line:LineService,
    private messageService: MessageService
    ){}
  
  connect(){
    console.log("Start Connect")
    this.line.setLineConnect = this.formConnect.value
    this.messageService.add({severity:'success', summary:'Connected', detail:'Connected Line Login'});
  }
  
}
