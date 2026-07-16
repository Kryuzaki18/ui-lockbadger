import { Injectable } from '@angular/core';
import { DefaultTitleStrategy, RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable()
export class AppTitleStrategy extends DefaultTitleStrategy implements TitleStrategy {
  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);

    document.title = title ? `${title} | Lockbadger` : 'Lockbadger';
  }
}
