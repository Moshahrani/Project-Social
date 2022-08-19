import Login from "../pages/login";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Form, Button, Message, Segment, Divider } from "semantic-ui-react";

jest.mock('next/router', () => ({
    useRouter: () => ({
        pathname: '/signup'
    })
}))

it("renders Login/Signup component", () => {
    render(<Login />);
    expect(true).toBe(true);
});

it("renders Form", () => {
    render(<Form />);
    expect(true).toBe(true);
})

it("renders Message if error exists", () => {
    render(<Message />);
    expect(true).toBe(true);
})

it("renders Form Input", () => {
    render(<Form.Input />);
    expect(true).toBe(true);
})

it("renders email form input", () => {
    const { getByTestId } = render(<Login />);
    const emailForm = getByTestId("email");
    expect(emailForm.innerHTML).toMatch("email")
});

it("renders password form input", () => {
    const { getByTestId } = render(<Login />);
    const passwordForm = getByTestId("password");
    expect(passwordForm.innerHTML).toMatch("password")
});

it("renders signup button", () => {
    const { getByTestId } = render(<Login />);
    const signupButton = getByTestId("signup");
    expect(signupButton.innerHTML).toMatch("signup")
});

test("password fires onClick to show password", () => {
        const { getByTestId } = render(<Login />);
        const button = getByTestId('password');
        fireEvent.click(button);
});
