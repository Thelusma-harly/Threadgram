import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import {
  useGetPosts,
  useSearchPost,
} from "@/lib/react-query/queriesAndMutations";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useInView } from "react-intersection-observer";
import type { IPost } from "@/types";

const Explore = () => {
  const { ref, inView } = useInView();

  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();

  const [searchValue, setSearchValue] = useState("");

  const [debouncedValue, setDebouncedValue] = useDebounce(searchValue, 500);

  const { data: searchedPost, isFetching: isSearchFetching } =
    useSearchPost(debouncedValue);

  const searchedPostRow: IPost[] = searchedPost?.rows || [];

  useEffect(() => {
    if (inView && hasNextPage && !searchValue) {
      fetchNextPage();
      console.log(hasNextPage);
    }
  }, [inView, searchValue, hasNextPage, fetchNextPage]);

  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  const shouldShowSearchResult = searchValue !== "";
  const shouldShowPost =
    !shouldShowSearchResult &&
    posts?.pages.every((item) => item?.rows.length === 0);

  console.log(posts?.pages);

  return (
    <div className="explore-container scrollbar-global overflow-x-hidden">
      <div className="explore-inner_container ">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            alt="search"
            width={24}
            height={24}
          />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search outline-none border-none"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold ">Popular Today</h3>
        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">
            {debouncedValue || "All"}
          </p>
          <img
            src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-9 w-full max-w-5xl max-md:mb-[175px]">
        {shouldShowSearchResult ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPost={searchedPostRow}
          />
        ) : shouldShowPost ? (
          <p className="text-light-4 mt-10 text-center w-full">End of Posts</p>
        ) : (
          posts?.pages.map((item, index) => {
            const rows: IPost[] = item?.rows || [];

            return (
              <GridPostList
                key={`page-${index}`}
                postType="Explore"
                posts={rows}
              />
            );
          })
        )}
        {hasNextPage && !searchValue ? (
          <div ref={ref} className="mt-10">
            <Loader />
          </div>
        ) : (
          posts &&
          !searchValue && (
            <p className="text-light-4 mt-10 text-center w-full">
              End of Posts
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default Explore;
