import { beforeAll, expect, test, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "src/app/page";

beforeAll(() => {
  render(<Page />);
});

describe("Page", () => {
  test("Add task button is present", () => {
    const text = screen.getByText("Add Task");
    expect(text).toBeDefined();
  });
});
