import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-error500',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './error500.component.html',
  styleUrls: ['./error500.component.css']
})
export class Error500Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
