import { render, screen } from "@testing-library/react";
import { Header } from "../src/components/Header";

describe("Header", () => {
  it("renders the header component", () => {
    render(<Header />);
    const headerElement = screen.getByText(/Caseload task system/i);
    expect(headerElement).toBeInTheDocument();
  });
});
