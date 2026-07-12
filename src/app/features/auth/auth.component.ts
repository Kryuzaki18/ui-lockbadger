import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AUTH_TEXT } from '../../core/constants/text.constant';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  public authText = AUTH_TEXT;
}

