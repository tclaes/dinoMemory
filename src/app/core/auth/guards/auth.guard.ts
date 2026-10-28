import { inject, Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  #auth = inject(AuthService);
  #router = inject(Router);

  canActivate() {
    return this.#auth.isLoggedIn() ? true : this.#router.navigate(["/login"]);
  }
}
