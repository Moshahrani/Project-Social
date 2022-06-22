import React, { useState, useRef } from "react";
import { Form, Button, Message, Divider } from "semantic-ui-react";
import ImageBoxDropoff from "../Basic/ImageBoxDropoff";
import SocialProfiles from "../Basic/SocialProfiles";
import uploadImage from "../../utilities/cloudinary";
import { profileUpdate } from "../../utilities/profileEvents";

function UpdateProfile({ Profile }) {
    const [profile, setProfile] = useState({
        profilePicUrl: Profile.user.profilePicUrl,
        bio: Profile.bio || "",
        // wrapped in parens to check if 
        // Project.social object is valid, fixed undefined error
        facebook: (Profile.social && Profile.social.facebook) || "",
        instagram: (Profile.social && Profile.social.instagram) || "",
        youtube: (Profile.social && Profile.social.youtube) || "",
        twitter: (Profile.social && Profile.social.twitter) || ""
    });

    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);


    const [highlighted, setHighlighted] = useState(false);
    const inputRef = useRef();
    const [media, setMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);

    // state for showing social media links, 
    // only when update button is pressed
    const [showSocialLinks, setShowSocialLinks] = useState(false);

    const handleChange = e => {
        const { name, value, files } = e.target;

        if (name === "media") {
            setMedia(files[0]);
            setMediaPreview(URL.createObjectURL(files[0]));
        }
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <Form
                error={errorMsg !== null}
                loading={loading}
                onSubmit={async e => {
                    e.preventDefault();
                    setLoading(true);

                    let profilePicUrl;

                    if (media !== null) {
                        profilePicUrl = await uploadImage
                            (media);
                    }

                    if (media !== null && !profilePicUrl) {
                        setLoading(false);
                        return setErrorMsg("Error Uploading Image");
                    }

                    await profileUpdate(profile, setLoading, setErrorMsg, profilePicUrl);
                }}
            >
                <Message
                    onDismiss={() => setErrorMsg(false)}
                    error
                    content={errorMsg}
                    attached
                    header="Oops!"
                />
                <ImageBoxDropoff
                    inputRef={inputRef}
                    highlighted={highlighted}
                    setHighlighted={setHighlighted}
                    handleChange={handleChange}
                    mediaPreview={mediaPreview}
                    setMediaPreview={setMediaPreview}
                    setMedia={setMedia}
                    profilePicUrl={profile.profilePicUrl}
                />
                <SocialProfiles
                    user={profile}
                    handleChange={handleChange}
                    showSocialLinks={showSocialLinks}
                    setShowSocialLinks={setShowSocialLinks}
                />
                <Divider hidden />
                <Button
                    color="blue"
                    icon="pencil alternate"
                    disabled={profile.bio === "" || loading}
                    content="Submit"
                    type="submit"
                />
            </Form>
        </>
    );
}

export default UpdateProfile;