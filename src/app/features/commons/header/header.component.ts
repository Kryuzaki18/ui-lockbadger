import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideBell, LucideMenu, LucidePlus, LucideSearch } from '@lucide/angular';

@Component({
  selector: 'app-header',
  imports: [LucideBell, LucideMenu, LucidePlus, LucideSearch],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Input() title = 'Dashboard';
  @Output() menuClick = new EventEmitter<void>();
}
