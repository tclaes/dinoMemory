import { Routes } from "@angular/router";
import { GameComponent } from "./game/playfield/components/page/game.component";
import { UserprofileComponent } from "./user/userprofile.component";
import { AuthGuard } from "./core/auth/guards/auth.guard";
import { RegisterComponent } from "./user/components/register/register.component";
import { LoginComponent } from "./user/components/login/login.component";
import { LayoutComponent } from "./ui/layout/layout.component";

export const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", component: GameComponent },
      { path: "game/:deck", component: GameComponent },
      { path: "user", component: UserprofileComponent },
    ],
  },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "**", redirectTo: "/" },
];
