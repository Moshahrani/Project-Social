import axios from "axios"

const uploadImage = async (media) => {

    try {
        const form = new FormData()

        form.append("file", media)
        form.append("upload_preset", "project_social")
        form.append("cloud_name", "moshhh")

        const result = await axios.post(process.env.CLOUDINARY_URL, form)
        console.log(result)
        return res.data.secure_url;
    } catch (error) {
        return
    }
}

export default uploadImage;
