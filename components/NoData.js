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

// letting user know that profile doesn't exist
export const NoProfile = () => (
  <Message info icon="meh" header="Hey!" content="No Profile Found." />
);

// letting user know that no posts from that profile exist yet
export const NoProfilePosts = () => (
  <>
    <Message info icon="meh" header="Sorry"
      content="User has not posted anything yet!" />
    <Button icon="long arrow alternate left" content="Go Back"
      as="a" href="/" />
  </>
);

// letting user know that there's no follower/following data available for that profile
export const NoFollowData = ({ followersComponent, followingComponent }) => (
  <>
    {followersComponent && (
      <Message icon="user outline" info content={`User does not have followers`} />
    )}

    {followingComponent && (
      <Message icon="user outline" info content={`User does not follow anyone`} />
    )}
  </>
);
