import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/angular";
import { CardComponent } from "./card.component";

describe("Card", () => {
  it("should create", async () => {
    await render(CardComponent, {
      inputs: {
        card: { id: "1", name: "dinos", coverIndex: 1 },
        deck: { name: "dinos" },
      },
    });
  });

  it("should emit an event on click", async () => {
    const flip = vi.fn();
    await render(CardComponent, {
      inputs: {
        card: { id: "1", name: "dinos", coverIndex: 1 },
        deck: { name: "dinos" },
      },
      on: { flip },
    });

    fireEvent.click(screen.getByRole("button", { name: /flip card/i }));

    expect(flip).toHaveBeenCalledTimes(1);
    expect(flip).toHaveBeenCalledWith("1");
  });
});
