import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideArrowLeft, LucideMail, LucideMailCheck, LucideSend } from '@lucide/angular';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink, LucideArrowLeft, LucideMail, LucideMailCheck, LucideSend],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);

  submitted = false;

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted = true;
  }

  get emailControl() {
    return this.form.get('email');
  }
}
