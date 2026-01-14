import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  useDeletePost,
  useGetPostById,
} from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString, transformImageUrl } from "@/lib/utils";
import type { IPost } from "@/types";
import React from "react";
import { Link, useParams } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams();

  const { data: post, isPending } = useGetPostById(id || "");
  const currentPost: IPost = post || {};
  const { user } = useUserContext();

  const {
    mutateAsync: deletePost,
    isPending: isDeletingPost,
    isSuccess,
  } = useDeletePost();

  const handleDeletePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    deletePost({ postId: post?.$id || "", imageId: post?.image_url || "" });
  };

  return (
    <div className="post_details-container scrollbar-global overflow-x-hidden">
      {isPending ? (
        <Loader />
      ) : isSuccess ? (
        <>
          <h2 className="text-light-4 mt-10 text-[50px] text-center w-full">
            Post Deleted
          </h2>
          <Link to="/">
            <Button className="shad-button_primary whitespace-nowrap cursor-pointer">
              Return back home
            </Button>
          </Link>
        </>
      ) : (
        <div className="post_details-card max-md:mb-[175px]">
          <img
            src={transformImageUrl(post?.image_url || "")}
            alt="post"
            className="post_details-img"
          />
          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.creator?.$id}`}
                className="flex items-center gap-3">
                <img
                  src={
                    transformImageUrl(post?.creator?.image_url || "") ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="post"
                  className="rounded-full w-8 h-8 lg:h-12 lg:w-12 object-cover"
                />
                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator?.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>{" "}
                    -{" "}
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="flex-center">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user?.id !== post?.creator?.$id && "hidden"}`}>
                  <img
                    src="/assets/icons/edit.svg"
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>
                <Button
                  onClick={handleDeletePost}
                  disabled={isDeletingPost}
                  variant="ghost"
                  className={`${
                    user?.id !== post?.creator?.$id && "hidden"
                  } ghost_details-delete_btn`}>
                  {isDeletingPost ? (
                    <Loader />
                  ) : (
                    <img
                      src="/assets/icons/delete.svg"
                      alt="delete"
                      width={24}
                      height={24}
                    />
                  )}
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />
            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags?.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full">
              <PostStats post={currentPost} userId={user?.id || ""} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
