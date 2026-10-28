import { Component, inject } from "@angular/core";
import { NavigationComponent } from "../../nav/navigation/navigation.component";
import { RouterLink, RouterOutlet } from "@angular/router";
import { AuthService } from "../../core/auth/services/auth.service";

@Component({
  selector: "app-layout",
  imports: [NavigationComponent, RouterLink, RouterOutlet],
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.css",
})
export class LayoutComponent {
  #authService = inject(AuthService);
  isLoggedIn = this.#authService.isLoggedIn;
}
