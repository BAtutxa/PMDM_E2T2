import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  constructor() {
    this.loadDarkMode();
  }

  loadDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'enabled';
    if (darkMode) {
      document.body.classList.add('dark');
    }
  }

  toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
  }
}
