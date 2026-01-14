import PostForm from "@/components/forms/PostForm";
import Loader from "@/components/shared/Loader";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import type { IUpdatePost } from "@/types";
import { useParams } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();

  const postId = id ? id : "";

  const { data: post, isPending: isLoadingPost } = useGetPostById(postId);

  const currentPost: IUpdatePost = post || {};

  return (
    <div className="flex flex-1">
      <div className="common-container scrollbar-global overflow-x-hidden max-md:mb-[175px]">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            alt="add"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>
        {isLoadingPost ? (
          <Loader />
        ) : (
          <PostForm action="Update" post={currentPost} />
        )}
      </div>
    </div>
  );
};

export default EditPost;
