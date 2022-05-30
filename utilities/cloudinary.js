import axios from "axios"

const uploadImage = async (media) => {
    try {
        const form = new FormData()

        form.append("file", media)
        form.append("upload_preset", "project_social")
        form.append("cloud_name", "moshhh")

        const result = await axios.post(process.env.CLOUDINARY_URL, form)
        return result.data.url

    } catch (error) {
        return
    }
}

export default uploadImage;
