import CommentField from "../components/Post/CommentField";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

it("renders CommentField component", () => {
    render(<CommentField />);
    expect(true).toBe(true);
});