import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  LucideVault,
  LucideShieldCheck,
  LucideLockKeyhole,
  LucideZap,
} from '@lucide/angular';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, LucideVault, LucideShieldCheck, LucideLockKeyhole, LucideZap],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {}
