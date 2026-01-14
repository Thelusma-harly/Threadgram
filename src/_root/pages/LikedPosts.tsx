import GridPostList from "@/components/shared/GridPostList";
import type { IPost } from "@/types";

const LikedPosts = ({ likedPosts }: { likedPosts: IPost[] }) => {
  console.log("LikedPosts:", likedPosts);
  return likedPosts && likedPosts.length > 0 ? (
    <GridPostList
      postType="Explore"
      posts={likedPosts}
      showUser={true}
      showStats={false}
    />
  ) : (
    <p>No liked posts found.</p>
  );
};

export default LikedPosts;
