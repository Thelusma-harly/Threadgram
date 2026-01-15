import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PostValidation } from "@/lib/validation";
import type z from "zod";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import {
  useCreatePost,
  useUpdatePost,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import type { PostFormProps } from "@/types";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Loader from "../shared/Loader";

const PostForm = ({ post, action }: PostFormProps) => {
  const { mutateAsync: createPost, isPending: isCreatingPost } =
    useCreatePost();

  const { mutateAsync: updatePost, isPending: isUpdatingPost } =
    useUpdatePost();

  const { user } = useUserContext();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post?.caption || "",
      file: [],
      location: post?.location || "",
      tags: Array.isArray(post?.tags) ? post.tags.join(", ") : post?.tags || "",
    },
  });

  const { isDirty } = form.formState;

  useEffect(() => {
    if (post) {
      const postValues = {
        caption: post?.caption || "",
        file: [],
        location: post?.location || "",
        tags: Array.isArray(post?.tags)
          ? post.tags.join(", ")
          : post?.tags || "",
      };

      form.reset(postValues);
    }
  }, [post, form]);

  async function onSubmit(values: z.infer<typeof PostValidation>) {
    if (!user.id) {
      return toast.error("You must be logged in to create a post.");
    }

    const createPostValues = { ...values, creator: user.id };
    const updatePostValue = {
      ...values,
      image_url: post?.image_url,
      image_id: post?.image_id,
      postId: post?.$id,
    };

    if (post && action === "Update") {
      const updatedPost = await updatePost(updatePostValue);

      if (!updatedPost) {
        return toast.error("Error updating post. Please try again.");
      }

      return navigate(`/posts/${post.$id}`);
    }

    const newPost = await createPost(createPostValues);

    if (!newPost) {
      return toast.error("Error creating post. Please try again.");
    }

    navigate("/");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photo</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.image_url}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (Seperated by " , "){" "}
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="Art, Expression, Learn"
                  {...field}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Link to="/">
            <Button type="button" className="shad-button_dark_4">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isCreatingPost || isUpdatingPost || !isDirty}
            className="shad-button_primary whitespace-nowrap">
            {(isCreatingPost || isUpdatingPost) && <Loader />}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
