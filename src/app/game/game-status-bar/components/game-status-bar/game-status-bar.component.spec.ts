import { Component } from "@angular/core";
import { render } from "@testing-library/angular";
import { describe, expect, it } from "vitest";

import { GameStatusBarComponent } from "./game-status-bar.component";
import { TimerComponent } from "../timer/timer.component";
import { ClicksComponent } from "../clicks/clicks.component";
import { RestartComponent } from "../restart/restart.component";

@Component({ selector: "app-timer", template: "" })
class TimerStubComponent {}

@Component({ selector: "app-clicks", template: "" })
class ClicksStubComponent {}

@Component({ selector: "app-restart", template: "" })
class RestartStubComponent {}

describe("GameStatusBarComponent", () => {
  it("shows the clicks, the timer and the restart button", async () => {
    const { container } = await render(GameStatusBarComponent, {
      importOverrides: [
        { replace: TimerComponent, with: TimerStubComponent },
        { replace: ClicksComponent, with: ClicksStubComponent },
        { replace: RestartComponent, with: RestartStubComponent },
      ],
    });

    expect(container.querySelector("app-clicks")).toBeTruthy();
    expect(container.querySelector("app-timer")).toBeTruthy();
    expect(container.querySelector("app-restart")).toBeTruthy();
  });
});
