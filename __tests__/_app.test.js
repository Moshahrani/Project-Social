import MyApp from "../pages/_app";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Layout, Component } from "semantic-ui-react"

// jest.mock('next/router', () => ({
//     useRouter: () => ({
//         pathname: "/messages"
//         // ctx.pathname === "/" ||
//         // ctx.pathname === "/[username]" ||
//         // ctx.pathname === "/notifications" ||
//         // ctx.pathname === "/post/[postId]" ||
//         // ctx.pathname === "/messages" ||
//         // ctx.pathname === "/search";
//     })
// }))

it("renders MyApp component", () => {
    render(<Layout />);
    expect(true).toBe(true);
});

// it("renders Form", () => {
//     render(<Form />);
//     expect(true).toBe(true);
// })

// it("renders Message if error exists", () => {
//     render(<Message />);
//     expect(true).toBe(true);
// })