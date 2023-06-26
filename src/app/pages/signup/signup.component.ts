import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, switchMap } from 'rxjs';
import { IUser } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  thumbnailUrl = '';
  subscriptions: Subscription[] = [];

  constructor(private authService: AuthService) {}

  signupForm: FormGroup = new FormGroup({
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      this.passwordValidator.bind(this),
    ]),
  });

  ngOnInit(): void {
    const firstNameControl = this.signupForm.get('firstName');
    if (firstNameControl) {
      const firstNameSubscription = firstNameControl.valueChanges.subscribe(() => {
        this.signupForm.get('password')?.updateValueAndValidity();
      });
      this.subscriptions.push(firstNameSubscription);
    }

    const lastNameControl = this.signupForm.get('lastName');
    if (lastNameControl) {
      const lastNameSubscription = lastNameControl.valueChanges.subscribe(() => {
        this.signupForm.get('password')?.updateValueAndValidity();
      });
      this.subscriptions.push(lastNameSubscription);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const values = this.signupForm.value;
      this.authService
        .getThumbnailUrl(values.firstName.length)
        .pipe(
          switchMap((thumbnail) => {
            const user: IUser = {
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              password: values.password,
              thumbnailUrl: thumbnail.thumbnailUrl,
            };
            this.thumbnailUrl = thumbnail.thumbnailUrl;
            return this.authService.addUser(user);
          })
        )
        .subscribe((user) => {
          console.log(user);
        });
    }
  }

  passwordValidator(control: FormControl): { [key: string]: boolean } | null {
    const password = control.value;
    const firstName = this.signupForm?.get('firstName')?.value;
    const lastName = this.signupForm?.get('lastName')?.value;

    if (
      password &&
      (password.length < 8 ||
        !/[a-z]/.test(password) ||
        !/[A-Z]/.test(password) ||
        (firstName && password.toLowerCase().includes(firstName.toLowerCase())) ||
        (lastName && password.toLowerCase().includes(lastName.toLowerCase())))
    ) {
      return { invalidPassword: true };
    }

    return null;
  }
}
