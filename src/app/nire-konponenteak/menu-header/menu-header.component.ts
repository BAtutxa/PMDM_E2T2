import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-menu-header',
  templateUrl: './menu-header.component.html',
  styleUrls: ['./menu-header.component.scss'],
})
export class MenuHeaderComponent  implements OnInit {

  esProfe: Boolean = false;
  constructor(private userService:UserService) { }

  ngOnInit() {
    this.mirarPrivilegios();

  }

  mirarPrivilegios(){
    const rol = this.userService.getRola().rola;
    if(rol === 'IR'){
      this.esProfe = true;
    }else{
      this.esProfe = false;
    }
  }
}
