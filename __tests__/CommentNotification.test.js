import CommentNotification from "../components/Notifications/CommentNotification";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

it("renders CommentNotification component", () => {
    render(<CommentNotification notification={{user: "", post: {_id: 123}}} />);
    expect(true).toBe(true);
});
