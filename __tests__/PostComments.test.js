import PostComments from "../components/Post/PostComments";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

it("renders PostComments component", () => {
    render(<PostComments comment={{user: {profilePicUrl: "we", name: "wwe", username: "wee"}}} user={{role: ""}}/>);
    expect(true).toBe(true);
});
