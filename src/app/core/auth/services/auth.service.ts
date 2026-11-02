import {
  computed,
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from "@angular/core";
import {
  Auth,
  GoogleAuthProvider,
  User as FirebaseUser,
} from "@angular/fire/auth";
import { Router } from "@angular/router";
import { AUTH_OPS } from "../auth-ops";
import { toSignal } from "@angular/core/rxjs-interop";
import { User } from "../../../user/model/user";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  injector = inject(Injector);
  #auth = inject(Auth);
  #ops = inject(AUTH_OPS);
  user$ = this.#ops.user(this.#auth);
  user = toSignal<FirebaseUser>(this.user$);
  isLoggedIn = computed(() => !!this.user());
  #router = inject(Router);

  get User() {
    return this.user;
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    await runInInjectionContext(this.injector, () =>
      this.#ops.signInWithPopup(this.#auth, provider),
    );
    await this.#router.navigate(["/"]);
  }

  async signInWithEmailAndPassword({ email, password }) {
    await this.#ops.signInWithEmailAndPassword(this.#auth, email, password);
    await this.#router.navigate(["/"]);
  }

  tryRegister(user: User) {
    this.#ops
      .createUserWithEmailAndPassword(this.#auth, user.email, user.password)
      .then((userCredential) => {
        this.#ops.updateProfile(userCredential.user, {
          displayName: user.name,
          photoURL: "",
        });
        console.log(userCredential.user.displayName);
      })
      .catch((err) => console.log("Something went wrong", err.message));
  }

  async logOut() {
    await this.#ops.signOut(this.#auth);
    await this.#router.navigate(["/login"]);
  }
}
