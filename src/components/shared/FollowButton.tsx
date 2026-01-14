import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useFollowUser } from "@/lib/react-query/queriesAndMutations";
import Loader from "./Loader";
import { checkIfUserFollows } from "@/lib/appwrite/api";
import type { IUser } from "@/types";

type FollowButtonProps = {
  profileUser: IUser;
  currentUser: IUser;
};

const FollowButton = ({ profileUser, currentUser }: FollowButtonProps) => {
  const [followLabel, setFollowLabel] = useState("");

  const { mutateAsync: followUser, isPending: isProcessingFollowAction } =
    useFollowUser();

  const handleFollowAction = async (e: React.MouseEvent) => {
    if (currentUser.$id !== profileUser.$id) {
      e.stopPropagation();
      e.preventDefault();
      await followUser({
        followedUser: profileUser,
        followerUser: currentUser,
      });
    }
  };

  useEffect(() => {
    const updateFollowLabel = async () => {
      try {
        const result = await checkIfUserFollows(
          profileUser?.$id || "",
          currentUser?.$id || ""
        );

        if (!result) {
          throw new Error("Couldn't check if User Followed");
        }

        let label = "";

        if (currentUser?.$id === profileUser.$id) {
          label = "See Your Profile";
        } else {
          label = result.isFollowing ? "Unfollow" : "Follow";
        }

        setFollowLabel(label);
      } catch (error) {
        console.log(error);
      }
    };

    updateFollowLabel();
  }, [profileUser, currentUser, isProcessingFollowAction]);

  return (
    <Button
      type="button"
      className="shad-button_primary px-8 cursor-pointer z-10"
      onClick={handleFollowAction}>
      {isProcessingFollowAction ? <Loader /> : followLabel}
    </Button>
  );
};

export default FollowButton;
