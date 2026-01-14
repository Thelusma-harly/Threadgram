import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import type { IPost } from "@/types";
import type { Models } from "appwrite";
import React, { useState } from "react";
import Loader from "./Loader";

type PostStatsProps = {
  post?: IPost;
  userId: string;
};

interface IRecords extends Models.Document {
  post?: string;
  user: string;
}

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList = post?.likes?.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState(likesList);

  const { mutateAsync: likePost } = useLikePost();
  const { mutateAsync: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavePost, isPending: isDeletingSave } =
    useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save?.find(
    (record: IRecords) => record.post === post?.$id
  );

  const isSaved = !!savedPostRecord;

  console.log(currentUser?.save[0]?.post, post?.$id, savedPostRecord);

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    let newLikes = likes ? [...likes] : [];

    const hasLiked = checkIsLiked(newLikes, userId);

    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }

    setLikes(newLikes);

    console.log("PostStats New Likes:", newLikes);

    likePost({ postId: post?.$id || "", likesArray: newLikes });
  };

  const handleSavePost = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const savedPostRecord = currentUser?.save?.find(
      (record: IRecords) => record.post === post?.$id
    );

    console.log("Saved Post Record:", savedPostRecord);

    if (savedPostRecord) {
      console.log("Unsaved");
      deleteSavePost(savedPostRecord.$id);
    } else {
      console.log("Saved");
      await savePost({ postId: post?.$id || "", userId: userId });
    }
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 ml-5">
        <img
          src={
            checkIsLiked(likesList || [], userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">
          {!likesList ? 0 : likesList.length}
        </p>
      </div>
      <div className="flex gap-2">
        {isSavingPost || isDeletingSave ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="save"
            width={20}
            height={20}
            onClick={handleSavePost}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
