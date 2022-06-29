const newMsgSound = senderName => {

    const sound = new Audio("/bell.mp3");

    sound && sound.play()

    if (senderName) {

        document.title = `New Message from ${senderName}`
        // if this chat is currently opened and
        //  not the focused tab of browser,
        // it will open this tab
    if (document.visibilityState === "visible") {
        setTimeout(() => {
            document.title = "Messages";
        }, 5000)
    }
    }
}

export default newMsgSound;