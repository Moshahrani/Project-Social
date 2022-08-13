import Index from "./pages/index";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";


describe("Home Screen", () => {
    it("renders a post/posts", () => {
        render(<Index />);
        // check if all components are rendered
        expect(screen.getByTestId("posts")).toBeInTheDocument();
    });
});