import ImageModal from "../components/Post/ImageModal";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

it("renders ImageModal component", () => {
    render(<ImageModal post={{picUrl: "werw", user: {profilePicUrl: "we"}}}
    likes={["bill"]} comments={["hey friend"]} comment={{user: {profilePicUrl: "ha"}}}/>);
    expect(true).toBe(true);
});


