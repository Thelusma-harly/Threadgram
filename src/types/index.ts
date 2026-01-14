type OptionalDocumentFields = {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  $databaseId?: string;
  $collectionId?: string;
};

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export interface IUpdatePost extends OptionalDocumentFields {
  creator?: IPost;
  postId?: string;
  caption?: string;
  image_id?: string;
  image_url?: string;
  file?: File[];
  location?: string;
  tags?: string;
}

export interface IUser extends OptionalDocumentFields {
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  image_url?: string;
  image_id?: string;
  bio?: string;
  file?: File[];
  follower_count?: number;
  following_count?: number;
  follower?: string[];
  followed?: string[];
  posts?: IPost[];
  liked?: IPost[];
}

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export interface INewPost extends OptionalDocumentFields {
  creator: string;
  caption?: string;
  file: File[];
  location?: string;
  tags?: string;
  image_url?: string;
  image_id?: string;
}

export interface IPostModels extends OptionalDocumentFields {
  creator?: IPost;
  caption?: string;
  file?: File[];
  location?: string;
  tags?: string[];
  image_url?: string;
  likes?: [];
}

export interface IPost extends OptionalDocumentFields {
  name?: string;
  username?: string;
  post?: IPostModels;
  creator?: IPost;
  caption?: string;
  file?: File[];
  location?: string;
  tags?: string[];
  image_url?: string;
  likes?: [];
}

export type PostFormProps = {
  post?: IUpdatePost;
  action: "Update" | "Create";
};

export interface UserFormProps extends OptionalDocumentFields {
  user?: IUser;
}

export type FollowAction = "follow" | "unfollow";

export type FollowLabel = "Follow" | "Unfollow";
