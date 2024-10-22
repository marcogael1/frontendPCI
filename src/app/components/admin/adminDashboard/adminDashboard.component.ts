import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../../config';

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
        facebook: ['', [Validators.pattern('https?://.+')]],  // Validación para URL
        twitter: ['', [Validators.pattern('https?://.+')]],   // Validación para URL
        linkedin: ['', [Validators.pattern('https?://.+')]],  // Validación para URL
        instagram: ['', [Validators.pattern('https?://.+')]], // Validación para URL
      }),
      slogan: ['', [Validators.required, Validators.maxLength(100)]], // Requerido, longitud máxima de 100
      logo: [''],  // Podrías agregar validación personalizada si es necesario
      pageTitle: ['', [Validators.required, Validators.maxLength(60)]],  // Requerido, longitud máxima de 60
      contact: this.fb.group({
        address: ['', [Validators.required, Validators.maxLength(255)]], // Requerido, longitud máxima de 255
        email: ['', [Validators.required, Validators.email]],            // Validación de formato de email
        phone: ['', [Validators.required, Validators.pattern('^\\+?[0-9 ]{7,15}$')]] // Validación de teléfono
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
    // Abre el widget de subida de Cloudinary
    const cloudinaryWidget = (window as any).cloudinary.createUploadWidget({
      cloudName: 'dbkqz95se',  
      uploadPreset: 'pcitecnologias'  
    }, (error: any, result: any) => {
      if (!error && result && result.event === "success") {
        this.logoPreview = result.info.secure_url;
        this.companyProfileForm.patchValue({ logo: result.info.secure_url });
      }
    });
    cloudinaryWidget.open();
  }

  onSubmit() {
    if (this.companyProfileForm.invalid) {
      alert('Por favor, completa los campos correctamente.');
      return;
    }

    const updatedProfile = this.companyProfileForm.value;

    this.http.put(`${this.apiUrl}`, updatedProfile).subscribe(
      (response) => {
        alert('Perfil actualizado con éxito');
      },
      (error) => {
        console.error('Error al actualizar el perfil:', error);
        alert('Hubo un error al actualizar el perfil. Inténtelo de nuevo.');
      }
    );
  }

  // Métodos para verificar si un campo tiene errores
  getControlError(controlName: string, groupName?: string): boolean {
    const control = groupName ? this.companyProfileForm.get([groupName, controlName]) : this.companyProfileForm.get(controlName);
    return (control?.invalid ?? false) && ((control?.dirty ?? false) || (control?.touched ?? false));
  }
  
  
}
