import { signal } from "@angular/core";
import { render, screen } from "@testing-library/angular";
import { describe, expect, it } from "vitest";

import { LayoutComponent } from "./layout.component";
import { AuthService } from "../../core/auth/services/auth.service";
import { DeckService } from "../../game/playfield/services/deck.service";

const deckService = {
  availableDecks: signal([]),
  selectedDeck: signal(undefined),
};

const renderLayout = (loggedIn: boolean) =>
  render(LayoutComponent, {
    routes: [],
    providers: [
      {
        provide: AuthService,
        useValue: { isLoggedIn: signal(loggedIn), logOut: () => {} },
      },
      { provide: DeckService, useValue: deckService },
    ],
  });

describe("LayoutComponent", () => {
  it("shows the header with navigation when a user is logged in", async () => {
    await renderLayout(true);

    expect(screen.getByRole("banner")).toBeTruthy();
    expect(screen.getByRole("link", { name: /memory!/i })).toBeTruthy();
    expect(screen.getByRole("navigation")).toBeTruthy();
  });

  it("hides the header when no user is logged in", async () => {
    await renderLayout(false);

    expect(screen.queryByRole("banner")).toBeNull();
    expect(screen.getByRole("main")).toBeTruthy();
  });
});
