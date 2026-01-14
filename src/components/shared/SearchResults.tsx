import Loader from "./Loader";
import GridPostList from "./GridPostList";
import type { IPost } from "@/types";

type SearchResultsProps = {
  isSearchFetching: boolean;
  searchedPost: IPost[];
};

const SearchResults = ({
  isSearchFetching,
  searchedPost,
}: SearchResultsProps) => {
  if (isSearchFetching) {
    return <Loader />;
  }

  if (searchedPost && searchedPost?.length > 0)
    return <GridPostList postType="Explore" posts={searchedPost} />;
  return (
    <p className="text-light-4 mt-10 text-center w-full">No Results Found</p>
  );
};

export default SearchResults;
