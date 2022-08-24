import Chat from "../components/Chats/Chat";
import "@testing-library/jest-dom";
import { useRouter } from "next/router";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import { Form, Segment, Header, Image } from "semantic-ui-react";

jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/messages",
            pathname: "/messages",
            query: "",
            asPath: "",
            isOnine: {},
        };
    },
}));

it("renders Chat component", () => {
    render(<Chat connectedUsers={[]} message={"hello"} chat={{}}messagesWith={[]} lastMessage={length=20} />);
    expect(true).toBe(true);
});
