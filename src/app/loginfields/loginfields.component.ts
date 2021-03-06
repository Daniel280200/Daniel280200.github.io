import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { fire } from "src/environments/environment";
import {
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import {
  locationValidate,
  inputStyle,
  getElementWithID,
} from "src/assets/funcs";

@Component({
  selector: "app-loginfields",
  template: `
    <!------------------------------start html code------------------------------>

    <div class="field">
      <label class="label">Email</label>
      <div class="control has-icons-left">
        <input
          id="email_input"
          class="input"
          type="email"
          placeholder="Email"
          (change)="styleChange('email')"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
        <span class="icon is-small is-right">
          <i id="email_icon" class="fas"></i>
        </span>
      </div>
      <p id="email_help" class="help is-danger"></p>
    </div>

    <div class="field">
      <label class="label">Password</label>
      <p class="control has-icons-left">
        <input
          id="password_input"
          class="input"
          type="password"
          placeholder="Password"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-lock"></i>
        </span>
      </p>
    </div>

    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" id="remember-me" />
          Remember Me
        </label>
      </div>
    </div>

    <div class="field">
      <p class="control">
        <button
          id="login_button"
          class="button is-success"
          (click)="onSubmit()"
        >
          Login
        </button>
      </p>
    </div>
    <!------------------------------end html code------------------------------>
  `,
  styles: [],
})
export class LoginfieldsComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    locationValidate();
  }
  onSubmit() {
    var userEmail = getElementWithID("email_input").value;
    var userPass = getElementWithID("password_input").value;
    if (
      [
        inputStyle("email"),
        userPass!=""
      ].every((x) => x)){
    if (getElementWithID("remember-me").checked) {
      setPersistence(fire.auth, browserLocalPersistence);
    } else {
      setPersistence(fire.auth, browserSessionPersistence);
    }
    signInWithEmailAndPassword(fire.auth, userEmail, userPass)
      .then(() => {
        window.sessionStorage.setItem("log", "true");
        this.router.navigateByUrl("/profile");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode=="auth/invalid-email") window.alert("can't use this email");
        else if (errorCode=="auth/user-not-found") window.alert("User does not exist");
        else window.alert("Error [" + errorCode + "]: " + errorMessage);
      });
  }else{
    window.alert("enter valid email and password!");
  }}
  styleChange(fieldRole: "email" | "password"): void {
    inputStyle(fieldRole);
  }
}
