import { Link } from "react-router-dom";
import { transformImageUrl } from "@/lib/utils";
import type { IUser } from "@/types";
import FollowButton from "./FollowButton";

interface UserCardProp {
  user: IUser;
  currentUser: IUser;
}

const UserCard = ({ user, currentUser }: UserCardProp) => {
  return (
    <Link to={`/profile/${user.$id}`} className="user-card">
      <img
        src={
          transformImageUrl(user?.image_url || "") ||
          "/assets/icons/profile-placeholder.svg"
        }
        alt="creator"
        className="rounded-full w-14 h-14 object-cover"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      <FollowButton profileUser={user} currentUser={currentUser} />
    </Link>
  );
};

export default UserCard;
