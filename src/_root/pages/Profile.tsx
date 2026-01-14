import GridPostList from "@/components/shared/GridPostList";
import {
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import LikedPosts from "./LikedPosts";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { transformImageUrl } from "@/lib/utils";
import Loader from "@/components/shared/Loader";
import FollowButton from "@/components/shared/FollowButton";

interface StabBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { user } = useUserContext();
  const { id } = useParams();

  const { data: currentUserData, isPending: isLoadingCurrentUser } =
    useGetUserById(user.id || "");

  const { data: profileUserData, isPending } = useGetUserById(id || "");

  const profileUser = profileUserData || {};
  const currentUser = currentUserData || {};

  const pathname = useLocation().pathname;

  return (
    <div className="profile-container scrollbar-global overflow-x-hidden max-md:mb-[175px]">
      {(isPending || isLoadingCurrentUser) && (!currentUser || !profileUser) ? (
        <>
          <h1>Loading User</h1>
          <Loader />
        </>
      ) : (
        <div className="profile-inner_container">
          <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
            <img
              src={
                transformImageUrl(profileUser?.image_url || "") ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="profile"
              className="w-28 h-28 lg:h-36 lg:w-36 rounded-full object-cover"
            />
            <div className="flex flex-col flex-1 justify-between md:mt-2">
              <div className="flex flex-col w-full">
                <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                  {profileUser?.name}
                </h1>
                <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                  @{profileUser?.username}
                </p>
              </div>

              <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
                <StatBlock
                  value={profileUser?.posts?.length || 0}
                  label="Posts"
                />
                <Link to={`/followers/${profileUser?.$id}`}>
                  <StatBlock
                    value={profileUser?.follower_count || 0}
                    label="Followers"
                  />
                </Link>
                <Link to={`/following/${profileUser?.$id}`}>
                  <StatBlock
                    value={profileUser?.following_count || 0}
                    label="Following"
                  />
                </Link>
              </div>

              <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
                {profileUser?.bio}
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <div className={`${user.id !== profileUser?.$id && "hidden"}`}>
                <Link
                  to={`/update-profile/${profileUser?.$id}`}
                  className="h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg">
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={20}
                    height={20}
                  />
                  <p className="flex whitespace-nowrap small-medium">
                    Edit Profile
                  </p>
                </Link>
              </div>
              <div className={`${user.id === profileUser?.$id && "hidden"}`}>
                <FollowButton
                  profileUser={profileUser}
                  currentUser={currentUser}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {profileUser?.$id === user.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "bg-dark-3!"
            }`}>
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "bg-dark-3!"
            }`}>
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route
          index
          element={
            profileUser?.posts?.length === 0 ? (
              <p className="text-light-4 mt-10 text-center w-full">
                No Posts Found
              </p>
            ) : (
              <GridPostList
                postType="Explore"
                posts={profileUser?.posts || []}
                showUser={true}
                showStats={false}
              />
            )
          }
        />
        {profileUser?.$id === user.id && (
          <Route
            path="/liked-posts"
            element={<LikedPosts likedPosts={profileUser?.liked || []} />}
          />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
