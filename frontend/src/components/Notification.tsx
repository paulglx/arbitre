import { Toast, ToastContainer } from 'react-bootstrap'
import { removeNotification, selectCurrentNotifications } from '../features/notification/notificationSlice'
import { useDispatch, useSelector } from 'react-redux'

const Notification = () => {

    const dispatch = useDispatch();
    const notifications = useSelector(selectCurrentNotifications);

    return notifications ? (
        <ToastContainer className='p-3' position="bottom-end">

            {notifications.map((notif: any, i: number) => (
                <Toast
                    key={i}
                    bg={notif.type}
                    onClose={() => { dispatch(removeNotification({ id: notif.id })) }}
                    show={true}
                    delay={3000}
                    autohide
                >
                    <Toast.Header>
                        <strong>Arbitre</strong>
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