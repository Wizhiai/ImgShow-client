import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from './user.service';
import { User } from './model/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})

export class LoginComponent implements OnInit {
  user: User;
  message: string;
  loginErr: boolean;

  ngOnInit(): void {
    this.user = new User();
  }

  constructor(
    private router: Router,
    private userService: UserService
  ){}

  login(user: User): void {
    if(!user.userName || !user.password){
      return;
    }
    this.userService.login(user)
      .then(msg => {
        if(msg.code === 200){
          localStorage.setItem('token', msg.token);
          sessionStorage.setItem('guest', 'false');
          this.router.navigate(['/']);
        }else{
          this.loginErr = true;
          this.message = msg.message;
        }
      });
  }

  guest(): void {
    this.userService.guest()
    .then(msg => {
      if(msg.code === 200){
        localStorage.setItem('token', msg.token);
        sessionStorage.setItem('guest', 'true');
        this.router.navigate(['/']);
      }else{
        this.loginErr = true;
        this.message = msg.message;
      }
    });
  }
}
