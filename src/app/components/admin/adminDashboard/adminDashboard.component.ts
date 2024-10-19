import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './adminDashboard.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  styleUrls: ['./adminDashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  information: any[] = [];
  formData = {
    type: '',
    description: ''
  };

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadInformation();
  }

  loadInformation() {
    this.adminService.findAll().subscribe(data => {
      this.information = data;
    });
  }

  onSubmit() {
    if (this.formData.type && this.formData.description) {
      this.adminService.create(this.formData).subscribe(() => {
        this.loadInformation();
        this.formData = { type: '', description: '' };
      });
    }
  }

  edit(item: any) {
    this.formData = { type: item.type, description: item.description };
  }

  delete(id: string) {
    this.adminService.remove(id).subscribe(() => {
      this.loadInformation();
    });
  }
}
