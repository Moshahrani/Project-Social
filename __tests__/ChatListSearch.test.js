import ChatListSearch from "../components/Chats/ChatListSearch";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

it("renders ChatListSearch component", () => {
    render(<ChatListSearch />);
    expect(true).toBe(true);
});
