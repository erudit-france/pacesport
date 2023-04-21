import { showNotification } from '@mantine/notifications';

export const Toast = {
    success: (message) => {
        showNotification({
            title: 'Succès',
            message: message,
            color: 'teal',
            autoClose: 5000,
        })
    },
    error: (message) => {
        showNotification({
            title: 'Erreur',
            message: message,
            color: 'teal',
            autoClose: 5000,
        })
    },
}

export default Toast;