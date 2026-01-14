import {
  useGetFollowersList,
  useGetFollowingList,
  useGetUserById,
} from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import { useParams } from "react-router-dom";
import UserCard from "@/components/shared/UserCard";
import { useUserContext } from "@/context/AuthContext";

const UserFollowerList = () => {
  const { user } = useUserContext();
  const { data: currentUserData, isPending: isLoadingCurrentUser } =
    useGetUserById(user.id || "");

  const currentUser = currentUserData || {};

  const { listType, id } = useParams();

  const { data: followers, isPending: isLoadingFollowers } =
    useGetFollowersList(id || "");
  const { data: following, isPending: isLoadingFollowing } =
    useGetFollowingList(id || "");

  return (
    <div className="flex flex-1">
      <div className="home-container scrollbar-global overflow-x-hidden">
        <h2 className="h3-bold md:h2-bold text-left w-full">
          {listType === "followers" ? "People Following Me" : "People I Follow"}
        </h2>
        {listType === "followers" ? (
          isLoadingFollowers || isLoadingCurrentUser ? (
            <Loader />
          ) : followers && followers.length > 0 ? (
            <ul className="user-grid">
              {followers.map((follower) => (
                <UserCard
                  key={follower.$id}
                  user={follower}
                  currentUser={currentUser}
                />
              ))}
            </ul>
          ) : (
            <p>No followers found.</p>
          )
        ) : isLoadingFollowing ? (
          <Loader />
        ) : following && following.length > 0 ? (
          <ul className="user-grid">
            {following.map((followedUser) => {
              console.log("Followed User:", followedUser);
              return (
                <UserCard
                  key={followedUser.$id}
                  user={followedUser}
                  currentUser={currentUser}
                />
              );
            })}
          </ul>
        ) : (
          <p>No following users found.</p>
        )}
      </div>
    </div>
  );
};

export default UserFollowerList;
