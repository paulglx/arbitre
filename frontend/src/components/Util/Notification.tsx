import { CheckIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { removeNotification, selectCurrentNotifications } from '../../features/notification/notificationSlice'
import { useDispatch, useSelector } from 'react-redux'

import { useEffect } from 'react';

//import { pushNotification } from '../../features/notification/notificationSlice';
//import { useEffect } from 'react';

const Notification = () => {

    const dispatch = useDispatch();
    const notifications = useSelector(selectCurrentNotifications);

    // Delete notification if timeCreated is more than 5 seconds ago
    useEffect(() => {
        const interval = setInterval(() => {
            notifications.forEach((notification: any) => {
                if (Date.now() - notification.timeCreated > 5000) {
                    dispatch(removeNotification({ id: notification.id }))
                }
            })
        }, 1000);
        return () => clearInterval(interval);
    }, [notifications, dispatch]);

    const statusIcon = (type: string) => {
        switch (type) {
            case 'success':
                return (
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-600 bg-green-100 border border-green-400 rounded-lg">
                        <CheckIcon className="w-4 h-4" aria-hidden="true" />
                        <span className="sr-only">Check icon</span>
                    </div>
                )
            case 'error':
                return (
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-600 bg-red-100 border-red-400 rounded-lg">
                        <XMarkIcon className="w-4 h-4" aria-hidden="true" />
                        <span className="sr-only">Check icon</span>
                    </div>
                )
            case 'warning':
                return (
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-yellow-600 bg-yellow-100 border-yellow-400 rounded-lg">
                        <ExclamationTriangleIcon className="w-4 h-4" aria-hidden="true" />
                        <span className="sr-only">Check icon</span>
                    </div>
                )
            case 'info':
                return (
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-600 bg-blue-100 border-blue-400 rounded-lg">
                        <InformationCircleIcon className="w-4 h-4" aria-hidden="true" />
                        <span className="sr-only">Check icon</span>
                    </div>
                )

            default:
                return <></>;
        }
    }

    return notifications.length > 0 ? (
        <div className='p-3 fixed bottom-5 right-5 z-10'>

            {notifications.map((notification: any, i: number) => (
                <div
                    id="toast-success"
                    className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-gray-50 rounded-lg border shadow" role="alert"
                    key={i}
                >
                    {statusIcon(notification.type)}
                    <div className="ml-3 text-sm font-normal">{notification.message}</div>
                    <button
                        type="button"
                        className="ml-auto -mx-1.5 -my-1.5 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
                        aria-label="Close"
                        onClick={() => { dispatch(removeNotification({ id: notification.id })) }}
                    >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="w-5 h-5" aria-hidden="true" />
                    </button>
                </div>
            ))}

        </div>
    ) : (<></>)
}

export default Notification