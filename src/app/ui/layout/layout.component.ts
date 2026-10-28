import { Component } from "@angular/core";
import { NavigationComponent } from "../../nav/navigation/navigation.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-layout",
  imports: [NavigationComponent, RouterLink],
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.css",
})
export class LayoutComponent {}
