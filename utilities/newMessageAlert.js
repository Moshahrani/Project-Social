const newMsgSound = senderName => {

    const sound = new Audio("/bell.mp3");

    sound && sound.play()

    if (senderName) {

        document.title = `New Message from ${senderName}`
        // will change tab message on chat tab to new Message
        // after 5 seconds, back to "Messages"
    if (document.visibilityState === "visible") {
        setTimeout(() => {
            document.title = "Messages";
        }, 5000)
    }
    }
}

export default newMsgSound;