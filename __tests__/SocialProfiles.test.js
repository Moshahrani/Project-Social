import SocialProfiles from "../components/Basic/SocialProfiles";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Form, Button, Divider } from "semantic-ui-react";

it("renders Social Profiles component", () => {
    render(<SocialProfiles user={{}} bio={{}}/>);
    expect(true).toBe(true);
});

it("renders Form.Field component", () => {
    render(<Form.Field />);
    expect(true).toBe(true);
});

it("renders Button component", () => {
    render(<Button />);
    expect(true).toBe(true);
});

// it("onClick of show social links button toggles links", () => {
//     const button = render(<SocialProfiles user={{}} bio={{}} showSocialLinks={true} setShowSocialLinks={{}}/>);
//     const links = button.getByTestId("showLinks");
//     fireEvent.click(links)
// })

it("renders Divider component", () => {
    render(<Divider />);
    expect(true).toBe(true);
});

it("renders Form.Input component and all social link options", () => {
    const { getByTestId } = render(<SocialProfiles user={{}} bio={{}} showSocialLinks={true}/>);
    const facebook = getByTestId("fb");
    const twitter = getByTestId("tw");
    const instagram = getByTestId("insta");
    const youtube = getByTestId("yt");
    expect(facebook.innerHTML).toMatch("facebook")
    expect(twitter.innerHTML).toMatch("twitter")
    expect(instagram.innerHTML).toMatch("instagram")
    expect(youtube.innerHTML).toMatch("youtube")
})


