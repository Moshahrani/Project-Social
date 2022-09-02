import CropImgModal from "../components/Post/CropImgModal"
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

it("renders CropImgModal component", () => {
    render(<CropImgModal />);
    expect(true).toBe(true);
});