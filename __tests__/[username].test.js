import Profile from "../pages/[username]";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";




// jest.mock('next/router', () => ({
//     useRouter: () => ({
//         query: {username: "Bob"},
//         pathname: '/[username]',
//         followersLength: 0,
//         followingLength: 0,
//         loggedUserFollowStats: {followers : [] },
//         profile: {}
//     })
// }))


// const useRouter = jest.spyOn(require('next/router'), 'useRouter');

// useRouter.mockImplementationOnce(() => ({
//   query: {username: "Bob"},
//   pathname: '/[username]',
//   followersLength: 0,
//   followingLength: 0,
//   loggedUserFollowStats: {followers : ["bill"] },
//   profile,
// }));



// it("renders Profile Component", () => {
//     render(<Profile user={"Bob"} />);
//     expect(true).toBe(true);
// });

