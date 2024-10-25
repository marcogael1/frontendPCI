import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../../config';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './adminDashboard.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  styleUrls: ['./adminDashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  companyProfileForm!: FormGroup;
  logoPreview: string | ArrayBuffer | null | undefined = null;
  private apiUrl = `${environment.apiUrl}company-profile`; 

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.companyProfileForm = this.fb.group({
      socialMedia: this.fb.group({
        facebook: ['', [Validators.pattern('https?://.+')]],  
        twitter: ['', [Validators.pattern('https?://.+')]],   
        linkedin: ['', [Validators.pattern('https?://.+')]], 
        instagram: ['', [Validators.pattern('https?://.+')]], 
      }),
      slogan: ['', [Validators.required, Validators.maxLength(100)]], 
      logo: [''],  
      pageTitle: ['', [Validators.required, Validators.maxLength(60)]],  
      contact: this.fb.group({
        address: ['', [Validators.required, Validators.maxLength(255)]], 
        email: ['', [Validators.required, Validators.email]],            
        phone: ['', [Validators.required, Validators.pattern('^\\+?[0-9 ]{7,15}$')]] 
      })
    });

    this.loadCompanyProfile();
  }

  loadCompanyProfile() {
    this.http.get(`${this.apiUrl}`).subscribe((profile: any) => {
      this.companyProfileForm.patchValue(profile);
      this.logoPreview = profile.logo;
    });
  }

  onFileSelected() {
    const cloudinaryWidget = (window as any).cloudinary.createUploadWidget({
      cloudName: 'dbkqz95se',
      uploadPreset: 'pcitecnologias',
      clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif'], 
      maxFileSize: 2000000  
    }, (error: any, result: any) => {
      if (!error && result && result.event === "success") {
        this.logoPreview = result.info.secure_url;
        this.companyProfileForm.patchValue({ logo: result.info.secure_url });
        Toastify({
          text: "Imagen subida con éxito.",
          duration: 3000,
          backgroundColor: "#4CAF50"
        }).showToast();
      } else if (error) {
        Toastify({
          text: "Error al subir la imagen. Asegúrate de que sea una imagen y que no exceda 2MB.",
          duration: 3000,
          backgroundColor: "#FF0000"
        }).showToast();
      }
    });
    cloudinaryWidget.open();
  }

  onSubmit() {
    if (this.companyProfileForm.invalid) {
      Toastify({
        text: "Por favor, completa los campos correctamente.",
        duration: 3000,
        backgroundColor: "#FFA500"
      }).showToast();
      return;
    }

    const updatedProfile = this.companyProfileForm.value;

    this.http.put(`${this.apiUrl}`, updatedProfile).subscribe(
      (response) => {
        Toastify({
          text: "Perfil actualizado con éxito.",
          duration: 3000,
          backgroundColor: "#4CAF50"
        }).showToast();
      },
      (error) => {
        console.error('Error al actualizar el perfil:', error);
        Toastify({
          text: "Hubo un error al actualizar el perfil. Inténtelo de nuevo.",
          duration: 3000,
          backgroundColor: "#FF0000"
        }).showToast();
      }
    );
  }

  getControlError(controlName: string, groupName?: string): boolean {
    const control = groupName ? this.companyProfileForm.get([groupName, controlName]) : this.companyProfileForm.get(controlName);
    return (control?.invalid ?? false) && ((control?.dirty ?? false) || (control?.touched ?? false));
  }
}
