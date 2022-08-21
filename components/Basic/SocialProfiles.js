import React from "react";
import { Form, Button, Message, TextArea, Divider } from "semantic-ui-react";

function SocialProfiles({
    user: { bio, facebook, instagram, youtube, twitter },
    handleChange,
    showSocialLinks,
    setShowSocialLinks
}) {
    return (
        <>
            <Form.Field
                required
                control={TextArea}
                name="bio"
                value={bio}
                onChange={handleChange}
                placeholder="bio"
            />
            <Button
                data-testid="showLinks"
                content="Add Social Links"
                color="red"
                icon="at"
                type="button"
                onClick={() => setShowSocialLinks(!showSocialLinks)}
            />
            {showSocialLinks && (
                <>
                    <Divider />
                    <Form.Input
                        data-testid="fb"
                        icon="facebook"
                        iconPosition="left"
                        name="facebook"
                        value={facebook}
                        onChange={handleChange}
                    />
                    <Form.Input
                        data-testid="tw" 
                        icon="twitter"
                        iconPosition="left"
                        name="twitter"
                        value={twitter}
                        onChange={handleChange}
                    />
                    <Form.Input
                        data-testid="insta"
                        icon="instagram"
                        iconPosition="left"
                        name="instagram"
                        value={instagram}
                        onChange={handleChange}
                    />
                    <Form.Input
                        data-testid="yt"
                        icon="youtube"
                        iconPosition="left"
                        name="youtube"
                        value={youtube}
                        onChange={handleChange}
                    />
                    <Message
                        icon="attention"
                        info
                        size="small"
                        header="Social Media Links Are Optional!"
                    />
                </>
            )}
        </>
    );
}

export default SocialProfiles;