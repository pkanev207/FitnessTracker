import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { User } from './user.model';
import { AuthData } from './auth.data.model';
import { TrainingService } from '../training/training.service';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  // private user?: User;
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService
  ) { }

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  }

  registerUser(authData: AuthData) {
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString(),
    // };

    this.afAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(res => {
        // console.log(res);
        // this.authSuccessfully();
      })
      .catch(error => console.log(error));
  }

  login(authData: AuthData) {
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString(),
    // };

    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(res => {
        // console.log(res);
        // this.authSuccessfully();
      })
      .catch(error => console.log(error));
  }

  logout() {
    // this.user = null;
    // this.user = undefined;
    this.afAuth.signOut();
    // this.trainingService.cancelSubscriptions();
    // this.authChange.next(false);
    // this.router.navigate(['/login']);
    // this.isAuthenticated = false;
  }

  // getUser() {
  //   return { ...this.user };
  // }

  isAuth() {
    // return this.user != null;
    // return this.user != undefined;
    return this.isAuthenticated;
  }

  // private authSuccessfully() {
  //   this.isAuthenticated = true;
  //   this.authChange.next(true);
  //   this.router.navigate(['/training']);
  // }
}
