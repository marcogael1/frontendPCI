import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-error400',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './error400.component.html',
  styleUrls: ['./error400.component.css']
})
export class Error400Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
