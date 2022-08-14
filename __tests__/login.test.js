import Login from "../pages/login";
import { Message } from "semantic-ui-react"
import HeaderMessage from "../components/Basic/WelcomeMessage"
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";


describe("Login Page", () => {
    it("renders aa header message", () => {
        render(<HeaderMessage />);
        // check if all components are rendered
       // expect(screen.getByTestId("posts")).toBeInTheDocument();
    });
});

// describe("Login Page", () => {
//     it("renders a post/posts", () => {
//         render(<Index />);
//         // check if all components are rendered
//         expect(screen.getByTestId("posts")).toBeInTheDocument();
//     });
// });
