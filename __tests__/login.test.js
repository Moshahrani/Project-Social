import Login from "../pages/login";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

jest.mock('next/router', () => ({
    useRouter: () => ({
        pathname: '/signup'
    })
}))

it("renders Login/Signup component", () => {
    render(<Login />);
    expect(true).toBe(true);
});

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
})

