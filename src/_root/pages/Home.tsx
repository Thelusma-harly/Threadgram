import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useGetPosts } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Home = () => {
  const {
    data: posts,
    isPending: isPostLoading,
    fetchNextPage,
    hasNextPage,
  } = useGetPosts();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="flex flex-1">
      <div className="home-container scrollbar-global overflow-x-hidden">
        <div className="home-posts max-md:mb-[175px]">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>

          {isPostLoading ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.pages?.map((post) =>
                post?.rows?.map((item) => (
                  <PostCard key={item.caption} post={item} />
                ))
              )}
            </ul>
          )}

          {hasNextPage ? (
            <div ref={ref} className="mt-10">
              <Loader />
            </div>
          ) : (
            posts && (
              <p className="text-light-4 mt-10 text-center w-full">
                End of Posts
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
