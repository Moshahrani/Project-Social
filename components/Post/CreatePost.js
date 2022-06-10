import React, { useState, useRef } from "react";
import { Form, Button, Divider, Image, Icon, Message } from "semantic-ui-react";
import uploadImage from "../../utilities/cloudinary";

function CreatePost(user, setPosts) {

    const [newPost, setNewPost] = useState({ text: "", location: "" });
    const [loading, setLoading] = useState(false);
    const inputRef = useRef();

    const [error, setError] = useState(null);
    const [highlight, setHighlight] = useState(false);
    const [media, setMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);

    const handleChange = e => {
        const { name, value, files } = e.target;

        if (name === "media") {
            setMedia(files[0]);
            setMediaPreview(URL.createObjectURL(files[0]));
        }

        // returning an object for newPost
        setNewPost(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => e.preventDefault();


    const addStyles = () => ({
        textAlign: "center",
        cursor: "pointer",
        height: "150px",
        width: "150px",
        border: "dotted",
        paddingTop: media === null && "60px",
        borderColor: highlight ? "green" : "black"
    });


    return <>
        <Form error={error !== null} onSubmit={handleSubmit} >
            <Message
                error
                onDismiss={() => setError(null)}
                content={error}
                header="Oops!"
            />

            <Form.Group>
                {/*  User's profile pic  */}
                <Image src={user.profilePicUrl}
                    circular
                    avatar
                    inline />
                <Form.TextArea
                    placeholder="What's Going On"
                    name="text"
                    value={newPost.text}
                    onChange={handleChange}
                    rows={4}
                    width={14}
                />
            </Form.Group>


            {/* Form for submitting location based information */}
            <Form.Group>
                <Form.Input value={newPost.location}
                    name="location"
                    onChange={handleChange}
                    label="Add Location"
                    icon="map marker alternate"
                    placeholder="Want to add a Location?"
                />

                <input ref={inputRef}
                    onChange={handleChange}
                    name="media"
                    style={{ display: "none" }}
                    type="file"
                    // meaning any image file
                    accept="image/*"
                />
            </Form.Group>
            
            {/* Drag and drop functionality */}
            <div
                style={addStyles()}
                onDrag={e => {
                    e.preventDefault();
                    setHighlight(true);
                }}
                onDragLeave={e => {
                    e.preventDefault();
                    setHighlight(false);
                }}
                onDrop={e => {
                    e.preventDefault();
                    setHighlight(true);

                  const droppedFile = Array.from(e.dataTransfer.files);
     
                  if (droppedFile?.length > 0) {
                    setMedia(droppedFile[0]);
                    setMediaPreview(URL.createObjectURL(droppedFile[0]));
                  }
                }}
              >

                {/* // conditional rendering for rendering preview of image user has uploaded */}
                {media === null ? (
                    <Icon
                        name="plus"
                        onClick={() => inputRef.current.click()}
                        size="big"
                    />) : (
                    <>
                        <Image
                            style={{ height: "150px", width: "150px" }}
                            src={mediaPreview}
                            alt="PostImage"
                            centered
                            size="medium"
                            onClick={() => inputRef.current.click()}
                        />
                    </>
                )}
            </div>
            <Divider hidden />

            {/* Post button with bold text */}
            <Button
                circular
                disabled={newPost.text === "" || loading}
                content={<strong>Post</strong>}
                style={{ backgroundColor: "#1DA1F2", color: "white" }}
                icon="send"
                loading={loading}
            />
        </Form>
        <Divider />
    </>
}

export default CreatePost;