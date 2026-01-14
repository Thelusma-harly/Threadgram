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
import { ProfileValidation } from "@/lib/validation";
import type z from "zod";
import type { UserFormProps } from "@/types";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../shared/Loader";
import ProfileUploader from "../shared/PorfileUploader";
import { Textarea } from "../ui/textarea";
import { useUpdateUser } from "@/lib/react-query/queriesAndMutations";

const UserForm = ({ user }: UserFormProps) => {
  const navigate = useNavigate();

  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateUser();

  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
    },
  });

  const { isDirty } = form.formState;

  async function onSubmit(values: z.infer<typeof ProfileValidation>) {
    const updatedUserData = {
      ...values,
      id: user?.$id || "",
      image_url: user?.image_url || "",
      image_id: user?.image_id || "",
    };
    try {
      const updatedUser = await updateUser(updatedUserData);

      if (!updatedUser) {
        toast.error("Failed to update profile. Please try again.");
        return;
      } else {
        toast.success("Profile updated successfully!");
        return navigate(`/profile/${updatedUser.$id}`);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-7 w-full mt-4 max-w-5xl">
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ProfileUploader
                  fieldChange={field.onChange}
                  profileUrl={user?.image_url}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Name</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Username</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Email</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Bio</FormLabel>
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
        <div className="flex gap-4 items-center justify-end">
          <Link to={`/profile/${user?.$id}`} className="shad-button_secondary">
            <Button type="button" className="shad-button_dark_4">
              Cancel
            </Button>
          </Link>
          <Button
            disabled={isUpdatingUser || !isDirty}
            type="submit"
            className="shad-button_primary whitespace-nowrap">
            {isUpdatingUser && <Loader />}
            Update Profile
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
