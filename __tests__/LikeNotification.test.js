import LikeNotification from "../components/Notifications/LikeNotification";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

it("renders LikeNotification component", () => {
    render(<LikeNotification notification={{post: {_id: ""},user: {profilePicUrl: "fkeafjlej"}}} />);
    expect(true).toBe(true);
});
