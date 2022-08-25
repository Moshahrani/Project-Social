import MessageField from "../components/Chats/MessageField";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

it("renders Message component", () => {
    render(<MessageField message={{sender: "bill"}} user={{_id: 123}}/>);
    expect(true).toBe(true);
});
