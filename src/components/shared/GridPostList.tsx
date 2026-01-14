import { useUserContext } from "@/context/AuthContext";
import { transformImageUrl } from "@/lib/utils";
import type { IPost } from "@/types";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type GridPostListProps = {
  posts: IPost[];
  postType: PostType;
  showUser?: boolean;
  showStats?: boolean;
};

type PostType = "Saved" | "Explore";

const GridPostList = ({
  posts,
  postType,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const { user } = useUserContext();
  const userId = user?.id;
  return (
    <ul className="grid-container">
      {posts?.map((item) => {
        const post = postType === "Saved" ? item.post : item;
        const currentUser =
          postType === "Saved" ? item?.post?.creator : item?.creator;
        return (
          <li key={post?.$id} className="relative min-w-80 h-80">
            <Link to={`/posts/${post?.$id}`} className="grid-post_link">
              <img
                src={transformImageUrl(post?.image_url || "")}
                alt="post"
                className="h-full w-full object-cover"
              />
            </Link>
            <div className="grid-post_user">
              {showUser && (
                <div className="flex items-center justify-start gap-2 flex-1">
                  <img
                    src={transformImageUrl(currentUser?.image_url || "")}
                    alt="creator"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <p className="line-clamp-1">{currentUser?.name}</p>
                </div>
              )}
              {showStats && <PostStats post={post} userId={userId} />}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default GridPostList;
