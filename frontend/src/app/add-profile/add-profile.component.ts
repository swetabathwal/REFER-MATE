import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-profile.component.html',
  styleUrl: './add-profile.component.scss'
})
export class AddProfileComponent implements OnInit {
  profileForm: FormGroup;
  progress = 0;
  profileImageUrl: string | ArrayBuffer | null = null;
  companyEmailVerified = false;
  companyEmailVerifying = false;
  companyEmailVerifyStatus = '';

  constructor(private readonly fb: FormBuilder, private readonly http: HttpClient) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      currentCompany: ['', Validators.required],
      linkedin: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.profileForm.valueChanges.subscribe(() => this.updateProgress());
    this.updateProgress();
  }

  updateProgress() {
    const controls = this.profileForm.controls;
    const total = Object.keys(controls).length;
    const filled = Object.values(controls).filter(ctrl => ctrl.valid && ctrl.value && ctrl.value.toString().trim() !== '').length;
    this.progress = Math.round((filled / total) * 100);
  }

  onProfilePicChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImageUrl = e.target?.result || null;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  triggerFileInput() {
    const fileInput = document.querySelector('.upload-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      // handle form submission, include this.profileImageUrl if needed
    }
  }

  verifyCompanyEmail() {
    const email = this.profileForm.get('companyEmail')?.value;
    if (!email) return;

    this.companyEmailVerifying = true;
    this.companyEmailVerifyStatus = 'Verifying...';

    this.http.post('/api/send-otp', { email }).subscribe({
      next: () => {
        this.companyEmailVerified = true;
        this.companyEmailVerifyStatus = 'Company email verified!';
        this.companyEmailVerifying = false;
      },
      error: (error) => {
        console.error('Error verifying company email:', error);
        this.companyEmailVerified = false;
        this.companyEmailVerifyStatus = 'Failed to verify company email.';
        this.companyEmailVerifying = false;
      }
    });
  }
}
