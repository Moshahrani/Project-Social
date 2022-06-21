import { Message, Button } from "semantic-ui-react";

// letting user know no posts are available
export const NoPosts = () => (
  <Message
    info
    icon="meh"
    header="Hey!"
    content="No Posts yet. Please follow someone!"
  />
);


export const NoProfile = () => (
  <Message info icon="meh" header="Hey!" content="No Profile Found." />
);

// 
export const NoProfilePosts = () => (
  <>
    <Message info icon="meh" header="Sorry"
      content="User has not posted anything yet!" />
    <Button icon="long arrow alternate left" content="Go Back"
      as="a" href="/" />
  </>
);
