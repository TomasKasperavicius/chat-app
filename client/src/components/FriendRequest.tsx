import { UserDefinition } from "@/pages";
import { Button, User } from "@nextui-org/react";
import { FunctionComponent } from "react";

interface FriendRequestProps {
    sender: UserDefinition;
}
 
const FriendRequest: FunctionComponent<FriendRequestProps> = ({sender}:FriendRequestProps) => {
    return ( 
        <div className="flex">
            <User name={sender.username} src={sender.avatar}/>
            <Button className="hover:opacity-70">Confirm</Button>
            <Button className="hover:opacity-70">Remove</Button>
        </div>
     );
}
 
export default FriendRequest;