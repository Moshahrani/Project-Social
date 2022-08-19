import Profile from "../pages/[username]";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Layout, Component } from "semantic-ui-react"

jest.mock('next/router', () => ({
    useRouter: () => ({
        pathname: '/[username]',
    }), 
    _id: "12345"
}))


it("renders Profile Component", () => {
    render(<Profile />);
    expect(true).toBe(true);
});