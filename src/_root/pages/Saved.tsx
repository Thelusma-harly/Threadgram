import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { useGetSavedPosts } from "@/lib/react-query/queriesAndMutations";

const Saved = () => {
  const { data: savedPosts, isPending } = useGetSavedPosts();
  const { user } = useUserContext();

  const userSavedPosts = savedPosts?.filter(
    (post) => post?.user?.$id === user?.id
  );

  console.log("Saved Posts:", userSavedPosts);
  return (
    <div className="flex flex-1">
      <div className="home-container scrollbar-global overflow-x-hidden max-md:mb-[150px]">
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Post</h2>
        {isPending ? (
          <Loader />
        ) : userSavedPosts && userSavedPosts.length > 0 ? (
          <GridPostList postType="Saved" posts={userSavedPosts} />
        ) : (
          <p className="text-light-4 mt-10 text-center w-full">
            No saved posts found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Saved;
