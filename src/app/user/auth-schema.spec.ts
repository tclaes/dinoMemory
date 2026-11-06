import { signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { form } from "@angular/forms/signals";
import { describe, expect, it } from "vitest";
import { applyPasswordRules } from "./auth-schema";

function passwordForm(initial: string) {
  return TestBed.runInInjectionContext(() =>
    form(signal({ password: initial }), (path) => applyPasswordRules(path.password)),
  );
}

describe("applyPasswordRules", () => {
  it("requires a password", () => {
    const f = passwordForm("");
    expect(f.password().errors()[0].message).toBe("Password is required");
  });

  it("enforces the minimum length with the shared message", () => {
    const f = passwordForm("abc");
    expect(f.password().errors()[0].message).toBe(
      "Password minimum of 6 characters",
    );
  });

  it("accepts a password of the minimum length", () => {
    expect(passwordForm("abcdef").password().valid()).toBe(true);
  });
});
