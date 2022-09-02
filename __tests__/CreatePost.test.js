import CreatePost from "../components/Post/CreatePost";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

it("renders CreatePost component", () => {
    render(<CreatePost user={{profilePicUrl: "ewr"}}/>);
    expect(true).toBe(true);
});