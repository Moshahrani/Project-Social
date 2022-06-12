import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContainerForToast = ({ children }) => (
    <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
    >
        {children}
    </ToastContainer>
);

export const PostDeleteToast = () => {
    return (
        <ContainerForToast>
            {toast.info("Deleted Successfully", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined
            })}
        </ContainerForToast>
    );
};

export const ErrorToast = ({ error }) => {
    return (
        <ContainerForToast>
            {toast.error(error, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined
            })}
        </ContainerForToast>
    );
};

export const MsgSentToast = () => (
    <ContainerForToast>
        {toast.success("Sent successfully", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined
        })}
    </ContainerForToast>
);