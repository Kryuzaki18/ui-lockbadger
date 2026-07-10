import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AUTH_TEXT } from '../../core/constants/text.constant';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  public authText = AUTH_TEXT;
}

