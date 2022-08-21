import ImageBoxDropoff from "../components/Basic/ImageBoxDropoff";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Form, Segment, Header, Image } from "semantic-ui-react";

jest.mock('next/router', () => ({
    useRouter: () => ({
        pathname: "/signup"
    })
}))

it("renders ImageBoxDropoff component", () => {
    render(<ImageBoxDropoff />);
    expect(true).toBe(true);
});

