import { Component, OnInit } from '@angular/core';
import { LineService } from '../core/services/line.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(private line:LineService) { }

  ngOnInit(): void {
  }

}
