import Message from "../components/Chats/Message";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

it("renders Message component", () => {
    render(<Message message={{sender: "bill"}} user={{_id: 123}}/>);
    expect(true).toBe(true);
});

