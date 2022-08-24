import Banner from "../components/Chats/Banner";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Grid, Image, Segment } from "semantic-ui-react";

it("renders Banner component", () => {
    render(<Banner bannerData={{}}name={"Jeff"} profilePicUrl={{}}/>);
    expect(true).toBe(true);
});


