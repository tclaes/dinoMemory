import { inject, Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { first, map } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  #auth = inject(AuthService);
  #router = inject(Router);

  canActivate() {
    // user() is undefined until Firebase resolves the auth state, so wait for the first emission.
    return this.#auth.user$.pipe(
      first(),
      map((user) => (user ? true : this.#router.createUrlTree(["/login"]))),
    );
  }
}
