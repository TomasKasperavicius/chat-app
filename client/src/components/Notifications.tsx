import { FunctionComponent, ReactNode } from "react";

interface NotificationsProps {
    notifications : FunctionComponent<{}>[];
}
 
const Notifications: FunctionComponent<NotificationsProps> = ({notifications}: NotificationsProps) => {
    return ( <div className="flex items-center justify-center p-10 m-10">
        {notifications.map((notification: unknown,key)=>{
            return <div key={key}>{notification as ReactNode}</div>
        })}
    </div> );
}
 
export default Notifications;