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

  it("should show the letter on a letter card", async () => {
    await render(CardComponent, {
      inputs: {
        card: { id: "b-letter", name: "b", coverIndex: 0, pairKey: "b", face: { kind: "letter", text: "b" } },
        deck: { name: "alfabet" },
      },
    });

    const letter = screen.getByRole("img", { name: "b" });
    expect(letter.textContent.trim()).toBe("b");
  });

  it("should show emoji and word on a word card", async () => {
    await render(CardComponent, {
      inputs: {
        card: {
          id: "b-word", name: "bal", coverIndex: 0, pairKey: "b",
          face: { kind: "word", text: "bal", emoji: "⚽" },
        },
        deck: { name: "alfabet" },
      },
    });

    const word = screen.getByRole("img", { name: "bal" });
    expect(word.textContent).toContain("⚽");
    expect(word.textContent).toContain("bal");
    expect(word.querySelector("mark").textContent).toBe("");
  });

  it("should highlight the sound inside the word", async () => {
    await render(CardComponent, {
      inputs: {
        card: {
          id: "ie-word", name: "vlieg", coverIndex: 0, pairKey: "ie",
          face: { kind: "word", text: "vlieg", emoji: "🪰", highlight: "ie" },
        },
        deck: { name: "alfabet" },
      },
    });

    expect(screen.getByRole("img", { name: "vlieg" }).querySelector("mark").textContent).toBe("ie");
  });

  it("should not render an image for a letter card", async () => {
    await render(CardComponent, {
      inputs: {
        card: { id: "b-letter", name: "b", coverIndex: 0, pairKey: "b", face: { kind: "letter", text: "b" } },
        deck: { name: "dinos", imgURL: "dinos" },
      },
    });

    expect(document.querySelector("img")).toBeNull();
  });
});
