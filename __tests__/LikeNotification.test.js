import LikeNotification from "../components/Notifications/LikeNotification";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

it("renders LikeNotification component", () => {
    render(<LikeNotification />);
    expect(true).toBe(true);
});
