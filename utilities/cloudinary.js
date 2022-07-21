import axios from "axios"

const uploadImage = async (media) => {

    try {
        const form = new FormData()

        form.append("file", media)
        form.append("upload_preset", "project_social")
        form.append("cloud_name", "moshhh")

        const res = await axios.post(process.env.CLOUDINARY_URL, form)

        return res;
    } catch (error) {
        return
    }
}

export default uploadImage;
