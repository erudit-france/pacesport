import { showNotification } from '@mantine/notifications';

export const Toast = {
    success: (message) => {
        showNotification({
            title: 'Succès',
            message: message,
            color: 'teal',
            autoClose: 2500,
        })
    },
    error: (message) => {
        showNotification({
            title: 'Erreur',
            message: message,
            color: 'red',
            autoClose: 2500,
        })
    },
    info: (message) => {
        showNotification({
            title: 'Information',
            message: message,
            color: 'cyan',
            autoClose: 2500,
        })
    },
}

export default Toast;