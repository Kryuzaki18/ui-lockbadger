import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
 {
    path: '',
    component: AuthComponent,
    canActivate: [guestGuard],
    children: [
      { path: 'login', component: LoginComponent, title: 'Login' },
      { path: 'signup', component: SignupComponent, title: 'Signup' },
      { path: 'forgot-password', component: ForgotPasswordComponent, title: 'Forgot password' },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: '/home/characters', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
