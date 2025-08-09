import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
   editProfile() {
    // Logic to allow admin to edit profile
    alert('Edit profile functionality is triggered.');
  }

  readyForWork() {
    // Logic for marking the user as ready for work
    alert('Ready for work action triggered.');
  }

  sharePosts() {
    // Logic for sharing posts
    alert('Share posts action triggered.');
  }

  updateProfile() {
    // Logic for updating the profile
    alert('Update profile action triggered.');
  }
}
