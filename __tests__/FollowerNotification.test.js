import FollowerNotification from "../components/Notifications/FollowerNotification";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

it("renders FollowerNotification component", () => {
    render(<FollowerNotification notification={{user: ""}}/>);
    expect(true).toBe(true);
});
