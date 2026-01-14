import {
  type INewPost,
  type INewUser,
  type IUpdatePost,
  type IUser,
} from "@/types";
import { account, avatars, storage, tablesDB } from "./config";
import { ID, ImageGravity, Query, type Models } from "appwrite";
import { appwriteConfig } from "./config";
import type { QueryFunctionContext } from "@tanstack/react-query";
import type { QUERY_KEYS } from "../react-query/queryKeys";

export const createUserAccount = async (user: INewUser) => {
  try {
    const newAccount = await account.create({
      userId: ID.unique(),
      email: user.email,
      password: user.password,
      name: user.name,
    });

    console.log("New Account:", newAccount);

    if (!newAccount) {
      throw new Error("Failed to create user account");
    }

    const avatarUrl = avatars.getInitials({
      name: user.name,
    });

    console.log("Avatar URL:", avatarUrl);

    const newUserObject = {
      account_id: newAccount.$id,
      name: newAccount.name,
      username: user.username,
      email: newAccount.email,
      image_url: avatarUrl,
    };

    console.log("New User Object:", newUserObject);

    const newUser = await saveUserToDB(newUserObject);

    console.log("New User saved to DB:", newUser);

    return newUser;
  } catch (error) {
    console.log("Error creating user account:", error);
    return error;
  }
};

export async function saveUserToDB(user: {
  account_id: string;
  name: string;
  username?: string;
  email: string;
  image_url: string;
}) {
  const { databaseId, userTableId } = appwriteConfig;

  try {
    const newUser = await tablesDB.createRow({
      databaseId: databaseId,
      tableId: userTableId,
      rowId: ID.unique(),
      data: user,
    });

    return newUser;
  } catch (error) {
    console.log("Error saving user to database:", error);
    return error;
  }
}

export const signInAccount = async (user: {
  email: string;
  password: string;
}) => {
  try {
    const sessionCredentials = {
      email: user.email,
      password: user.password,
    };

    console.log("Session Credentials:", sessionCredentials);

    const session = await account.createEmailPasswordSession(
      sessionCredentials
    );

    return session;
  } catch (error) {
    console.log("Error signing in:", error);
    return error;
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) {
      return;
    }

    const currentUser = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.userTableId,
      queries: [
        Query.equal("account_id", currentAccount.$id),
        Query.select(["*", "save.*"]),
      ],
    });

    if (!currentUser) {
      return;
    }

    return currentUser.rows[0];
  } catch (error) {
    console.log("Error getting current user:", error);
  }
};

export async function signOutAccount() {
  try {
    const session = await account.deleteSession({
      sessionId: "current",
    });

    return session;
  } catch (error) {
    console.log("Error signing out:", error);
  }
}

export async function createPost(post: INewPost) {
  try {
    const uploadedFile = (await uploadFile(post.file[0])) as Models.File;

    if (!uploadedFile) {
      throw new Error("File upload failed");
    }

    const uploadedFileId = uploadedFile.$id;

    const fileUrl = getFilePreview(uploadedFileId);

    if (!fileUrl) {
      await deleteFile(uploadedFileId);
      throw Error;
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const data = {
      creator: post.creator,
      caption: post.caption,
      image_url: fileUrl,
      image_id: uploadedFileId,
      location: post.location,
      tags,
    };

    const newPost = await tablesDB.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.postTableId,
      rowId: ID.unique(),
      data,
    });

    if (!newPost) {
      await deleteFile(uploadedFileId);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log("Error creating post:", error);
    return error;
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile({
      bucketId: appwriteConfig.storageId,
      fileId: ID.unique(),
      file,
    });

    if (!uploadedFile) {
      throw new Error("File upload failed");
    }

    return uploadedFile;
  } catch (error) {
    console.log("Error uploading file:", error);
    return error;
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview({
      bucketId: appwriteConfig.storageId,
      fileId,
      width: 2000,
      height: 2000,
      gravity: ImageGravity.Top,
      quality: 100,
    });

    if (!fileUrl) {
      throw new Error("Failed to get file preview");
    }

    return fileUrl;
  } catch (error) {
    console.log("Error getting file preview:", error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile({
      bucketId: appwriteConfig.storageId,
      fileId,
    });

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts() {
  try {
    const posts = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.postTableId,
      queries: [
        Query.orderDesc("$createdAt"),
        Query.limit(20),
        Query.select(["*", "save.*", "likes.*"]),
      ],
    });

    if (!posts) {
      throw new Error("Failed to fetch recent posts");
    }

    return posts.rows;
  } catch (error) {
    console.log("Error getting recent posts:", error);
    return error;
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  console.log(likesArray);
  try {
    const updatedPost = await tablesDB.updateRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.postTableId,
      rowId: postId,
      data: {
        likes: likesArray,
      },
    });

    if (!updatedPost) {
      throw new Error("Failed to like post");
    }

    return updatedPost;
  } catch (error) {
    console.log("Error liking post:", error);
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const updatedPost = await tablesDB.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.savesTableId,
      rowId: ID.unique(),
      data: {
        user: userId,
        post: postId,
      },
    });

    if (!updatedPost) {
      throw new Error("Failed to like post");
    }

    return updatedPost;
  } catch (error) {
    console.log("Error liking post:", error);
  }
}

export async function getSavedPosts() {
  try {
    const savedPosts = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.savesTableId,
      queries: [
        Query.orderDesc("$createdAt"),
        Query.select([
          "*",
          "post.*",
          "user.*",
          "post.likes.*",
          "post.creator.*",
        ]),
      ],
    });

    if (!savedPosts) {
      console.log("error");
      throw new Error("Failed to get saved posts");
    }

    console.log(savedPosts.rows);

    return savedPosts.rows;
  } catch (error) {
    console.log("Error getting saved posts:", error);
  }
}

export async function deleteSavePost(savedRecordId: string) {
  try {
    const statusCode = await tablesDB.deleteRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.savesTableId,
      rowId: savedRecordId,
    });

    if (!statusCode) {
      throw new Error("Failed to like post");
    }

    return { status: "ok" };
  } catch (error) {
    console.log("Error liking post:", error);
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await tablesDB.getRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.postTableId,
      rowId: postId,
      queries: [
        Query.select(["*", "creator.*", "caption.*", "image_url.*", "likes.*"]),
      ],
    });

    if (!post) {
      throw new Error("Failed to get post by ID");
    }

    return post;
  } catch (error) {
    console.log("Error getting post by ID:", error);
  }
}

export async function updatePost(post: IUpdatePost) {
  const fileLength = post?.file?.length || 0;
  const hasFileToUpdate = fileLength > 0;

  let image = {
    image_url: post.image_url,
    image_id: post.image_id,
  };

  try {
    if (hasFileToUpdate) {
      const postFile = post?.file && post.file.length > 0 && post.file[0];

      if (!postFile) {
        throw new Error("Failed to find the post file");
      }

      const uploadedFile = (await uploadFile(postFile)) as Models.File;

      console.log("Uploaded File in updatePost:", uploadedFile);

      if (!uploadedFile) {
        throw new Error("File upload failed");
      }

      const uploadedFileId = uploadedFile.$id;

      const fileUrl = getFilePreview(uploadedFileId);

      if (!fileUrl) {
        await deleteFile(uploadedFileId);
        throw new Error();
      }

      image = { ...image, image_url: fileUrl, image_id: uploadedFileId };
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const data = {
      caption: post.caption,
      image_url: image.image_url,
      image_id: image.image_id,
      location: post.location,
      tags,
    };

    const updatedPost = await tablesDB.updateRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.postTableId,
      rowId: post.postId || "",
      data,
    });

    console.log("Updated Post Response:", updatedPost);

    if (!updatedPost) {
      await deleteFile(post.postId || "");
      throw new Error();
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function deletePost(postId: string, imageId: string) {
  try {
    if (!postId || !imageId) throw new Error();

    await tablesDB.deleteRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.postTableId,
      rowId: postId,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({
  pageParam,
}: QueryFunctionContext<QUERY_KEYS[], string | undefined>) {
  const queries = [
    Query.orderDesc("$createdAt"),
    Query.limit(2),
    Query.select(["*", "creator.*", "likes.*", "save.*"]),
  ];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.postTableId,
      queries,
    });

    if (!posts) {
      throw new Error();
    }

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function searchPosts(searchTerm?: string) {
  try {
    const posts = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.postTableId,
      queries: [
        Query.search("caption", searchTerm || ""),
        Query.select(["*", "creator.*", "likes.*", "save.*"]),
      ],
    });

    if (!posts) {
      throw new Error();
    }

    console.log(posts);
    return posts;
  } catch (error) {
    console.log(error);
  }
}

export const getUserById = async (userId: string) => {
  try {
    const userData = await tablesDB.getRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.userTableId,
      rowId: userId,
      queries: [Query.select(["liked.*"])],
    });

    if (!userData) {
      throw new Error("Failed to get user by ID");
    }

    const posts = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.postTableId,
      queries: [
        Query.equal("creator", userId),
        Query.orderDesc("$createdAt"),
        Query.select(["*", "likes.*", "save.*", "creator.*"]),
      ],
    });

    const likedPosts = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.postTableId,
      queries: [
        Query.equal("likes.$id", userId),
        Query.orderDesc("$createdAt"),
        Query.select(["*", "likes.*", "creator.*"]),
      ],
    });

    console.log("Liked Posts:", likedPosts);

    if (!posts) {
      throw new Error("Failed to get user's posts");
    }

    const user = {
      ...userData,
      posts: posts.rows,
      liked: likedPosts.rows,
    };

    if (!user) {
      throw new Error("Failed to get user by ID");
    }

    return user as unknown as IUser;
  } catch (error) {
    console.log("Error getting user by ID:", error);
  }
};

export const getUsers = async (currentUserId: string) => {
  try {
    const users = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.userTableId,
      queries: [Query.notEqual("$id", currentUserId)],
    });
    if (!users) {
      throw new Error("Failed to get users");
    }
    console.log(users.rows);
    return users.rows;
  } catch (error) {
    console.log("Error getting users:", error);
  }
};

export const updateUser = async (user: IUser) => {
  const fileLength = user?.file?.length;

  const hasFileToUpdate = fileLength || 0 > 0;

  let image = {
    image_url: user.image_url,
    image_id: user.image_id,
  };

  try {
    if (hasFileToUpdate) {
      const userFile = user?.file?.[0];

      if (!userFile) {
        throw new Error("Could not find User File");
      }

      const uploadedFile = (await uploadFile(userFile)) as Models.File;

      console.log("Uploaded File in updateUser:", uploadedFile);

      if (!uploadedFile) {
        throw new Error("File upload failed");
      }

      const uploadedFileId = uploadedFile.$id;

      const fileUrl = getFilePreview(uploadedFileId);

      if (!fileUrl) {
        await deleteFile(uploadedFileId);
        throw new Error();
      }

      image = { ...image, image_url: fileUrl, image_id: uploadedFileId };
    }

    const data = {
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      image_url: image.image_url,
      image_id: image.image_id,
    };

    console.log("user id:", user);

    const updatedUser = await tablesDB.updateRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.userTableId,
      rowId: user?.id || "",
      data,
    });

    console.log("Updated User Response:", updatedUser);

    if (!updatedUser) {
      await deleteFile(user.$id || "");
      throw new Error();
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const updateFollowCount = async (followedId: string, followerId: string) => {
  const followedData = await getFollowersList(followedId);
  const followerData = await getFollowingList(followerId);

  const followedUserCount = followedData?.length;
  const followerUserCount = followerData?.length;

  try {
    const updatedFollowedCount = await tablesDB.updateRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.userTableId,
      rowId: followedId || "",
      data: {
        follower_count: followedUserCount,
      },
    });

    if (!updatedFollowedCount) {
      throw new Error("Failed to update followed count");
    }

    const updatedFollowerCount = await tablesDB.updateRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.userTableId,
      rowId: followerId || "",
      data: {
        following_count: followerUserCount,
      },
    });

    if (!updatedFollowerCount) {
      throw new Error("Failed to update follower count");
    }

    console.log("Follow counts updated successfully");

    return { status: "updated" };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update follow counts");
  }
};

export const checkIfUserFollows = async (
  followedId: string,
  followerId: string
) => {
  try {
    const checkFollowRecord = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.followsTableId,
      queries: [
        Query.equal("followed_user", followedId || ""),
        Query.equal("follower_user", followerId || ""),
      ],
    });

    console.log("Check Follow Record:", checkFollowRecord);

    const isFollowing = checkFollowRecord.total > 0 ? true : false;

    return { isFollowing, checkFollowRecord };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to check follow status");
  }
};

export const followUser = async (followedUser: IUser, followerUser: IUser) => {
  const followedId = followedUser?.$id || "";
  const followerId = followerUser?.$id || "";

  try {
    const followRecord = await checkIfUserFollows(followedId, followerId);

    if (!followRecord) {
      throw new Error("Failed to determine follow status");
    }

    if (!followRecord?.isFollowing) {
      const newFollow = await tablesDB.createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.followsTableId,
        rowId: ID.unique(),
        data: {
          followed_user: followedId,
          follower_user: followerId,
        },
      });

      if (!newFollow) {
        throw new Error("Failed to follow user");
      }

      const updateFollowData = await updateFollowCount(followedId, followerId);

      if (updateFollowData.status !== "updated") {
        throw new Error("Failed to update follow counts after following user");
      }

      return true;
    } else if (followRecord.isFollowing) {
      const deletedFollowRecord = await tablesDB.deleteRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.followsTableId,
        rowId: followRecord.checkFollowRecord.rows[0].$id,
      });

      if (!deletedFollowRecord) {
        throw new Error("Failed to unfollow user");
      }

      const updateFollowData = await updateFollowCount(followedId, followerId);

      if (updateFollowData.status !== "updated") {
        throw new Error(
          "Failed to update follow counts after unfollowing user"
        );
      }
    }

    return false;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update follow status");
  }
};

export async function getFollowersList(userId: string) {
  try {
    const followersData = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.followsTableId,
      queries: [
        Query.equal("followed_user", userId),
        Query.select(["*", "follower_user.*"]),
      ],
    });

    if (!followersData) {
      throw new Error("Failed to fetch followers list");
    }

    const followerList = followersData.rows.map((row) => row.follower_user);

    return followerList;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch followers list");
  }
}

export async function getFollowingList(userId: string) {
  try {
    const followingData = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.followsTableId,
      queries: [
        Query.equal("follower_user", userId),
        Query.select(["*", "followed_user.*"]),
      ],
    });

    if (!followingData) {
      throw new Error("Failed to fetch following list");
    }

    const followingList = followingData.rows.map((row) => row.followed_user);

    return followingList;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch following list");
  }
}
