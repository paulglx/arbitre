import { Toast, ToastContainer } from 'react-bootstrap'
import { pushNotification, removeNotification, selectCurrentNotifications } from '../features/notification/notificationSlice'
import { useDispatch, useSelector } from 'react-redux'

import { useEffect } from 'react';

const Notification = () => {

    const dispatch = useDispatch();
    const notifications = useSelector(selectCurrentNotifications);

    //testing
    useEffect(() => {
        dispatch(pushNotification({
            id: 1,
            message: "This is a test notif",
            type: "light"
        }))
    }, [dispatch])

    return notifications ? (
        <ToastContainer className='p-3' position="bottom-end">

            {notifications.map((notif: any, i: number) => (
                <Toast key={i} bg={notif.type} onClose={() => { dispatch(removeNotification({ id: notif.id })) }} show={true} delay={3000} autohide>
                    <Toast.Header>
                        Notification
                    </Toast.Header>
                    <Toast.Body>
                        {notif.message}
                    </Toast.Body>
                </Toast>
            ))}

        </ToastContainer>
    ) : (<></>)
}

export default Notification