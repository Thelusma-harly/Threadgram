import UserCard from "@/components/shared/UserCard";
import { useUserContext } from "@/context/AuthContext";
import {
  useGetUserById,
  useGetUsers,
} from "@/lib/react-query/queriesAndMutations";
import { Loader } from "lucide-react";

const AllUsers = () => {
  const { user } = useUserContext();
  const { data: currentUserData, isPending: isLoadingCurrentUser } =
    useGetUserById(user.id);

  const currentUser = currentUserData || {};

  const { data: creators, isPending: isLoadingUsers } = useGetUsers(user.id);

  return (
    <div className="common-container scrollbar-global overflow-x-hidden">
      <div className="user-container ">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isLoadingUsers && isLoadingCurrentUser && !creators && !currentUser ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators?.map((creator) => (
              <li key={creator?.$id} className="flex-1 min-w-[200px] w-full  ">
                <UserCard user={creator} currentUser={currentUser || {}} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
