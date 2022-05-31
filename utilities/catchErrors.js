const catchErrors = error => {
    let errorMsg;

    if (error.response) {

        // if the request was made and the server didn't respond with a status code in the 200 range
        errorMsg = error.response.data;
        console.error(errorMsg);

    } else if (error.request) {

        // if the request was made but no response from the server
        errorMsg = error.request;
        console.error(errorMsg);

    } else {

        // if something else entirely occurred during the request
        errorMsg = error.message;
        console.error(errorMsg);
    }
    return errorMsg;
};

export default catchErrors;