import React, { useEffect, useState } from "react";
import { Button, Grid, Header, Icon, Modal } from "semantic-ui-react";
import Cropper from "react-cropper";

function CropImgModal({ mediaPreview, setMedia, showModal, setShowModal }) {

  // cropper state 
  const [cropper, setCropper] = useState();

  // get cropped image
  const getCropData = () => {
    if (cropper) {
      setMedia(cropper.getCroppedCanvas().toDataURL());
      // release cropper from memory
      cropper.destroy();
    }
    // close modal after media is updated
    setShowModal(false);
  };

  // add event listener when cropper state changes 
  // same as buttons below
  useEffect(() => {

    window.addEventListener("keydown", ({ key }) => {
      if (cropper) {
        if (key === "c") cropper.setDragMode("crop");
        if (key === "m") cropper.setDragMode("move");
        if (key === "r") cropper.reset();
      }
    });
  }, [cropper]);

  return (
    <>
      <Modal
        size="large"
        closeOnDimmerClick={false}
        open={showModal}
        onClose={() => setShowModal(false)}
      >
        <Modal.Header content="Crop image before uploading" />

        <Grid columns={2}>
          <Grid.Column>
            <Modal.Content image>
              {/* // cropper with numerous properties including 
              // zooming in/out with mouse or pinch zoom on mobile/tablet, 
              // resizing crop option, drag,  */}
              <Cropper
                style={{ height: "400px", width: "100%" }}
                background={false}
                checkOrientation={false}
                initialAspectRatio={1}
                autoCropArea={1}
                cropBoxResizable
                dragMode="move"
                highlight
                responsive
                guides
                //  cropper can only generate preview from URL string,
                //  not from any object, hence mediaPreview is passed and not
                //  the state
                src={mediaPreview}
                viewMode={1}
                minCropBoxHeight={10}
                minContainerWidth={10}
                preview=".img-preview"
                // cropper instance passing to cropper state
                onInitialized={cropper => setCropper(cropper)}
                zoomable
              />
            </Modal.Content>
          </Grid.Column>
          {/* // column on the right of the cropper component showing the final state 
            // of the image after cropping allowing user to preview final edit 
            //  before submitting image */}
          <Grid.Column>
            <Modal.Content image>
              <div>
                <Header as="h2">
                  <Icon name="file image outline" />
                  <Header.Content content="Final" />
                </Header>

                <div>
                  <div
                    style={{
                      width: "100%",
                      height: "300px",
                      display: "inline-block",
                      padding: "10px",
                      overflow: "hidden",
                      boxSizing: "border-box"
                    }}
                    className="img-preview"
                  />
                </div>
              </div>
            </Modal.Content>
          </Grid.Column>
        </Grid>

        <Modal.Actions>
          {/* // button to reset cropping of image  */}
          <Button
            icon="redo"
            circular
            title="Reset (R)"
            onClick={() => cropper && cropper.reset()}
          />
          {/* // button to move image before cropping */}
          <Button
            icon="move"
            circular
            title="Move Canvas (M)"
            onClick={() => cropper && cropper.setDragMode("move")}
          />
          {/* // button to create a new cropbox of any size */}
          <Button
            icon="crop"
            circular
            title="New Cropbox (C)"
            onClick={() => cropper && cropper.setDragMode("crop")}
          />
          {/* // button to cancel in red color */}
          <Button
            icon="cancel"
            content="Cancel"
            negative
            onClick={() => setShowModal(false)}
          />
          {/* // button to finalize crop image */}
          <Button
            icon="checkmark"
            content="Crop Image"
            positive
            onClick={getCropData}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default CropImgModal;