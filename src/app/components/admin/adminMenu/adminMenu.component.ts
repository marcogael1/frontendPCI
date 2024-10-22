import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-adminMenu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './adminMenu.component.html',
  styleUrls: ['./adminMenu.component.css']
})
export class AdminMenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
