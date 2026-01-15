import UserForm from "@/components/forms/UserForm";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom";

const UpdateProfile = () => {
  const { id } = useParams();
  const userId = id ? id : "";
  const { data: user } = useGetUserById(userId);

  return (
    <div className="flex flex-1">
      <div className="common-container scrollbar-global overflow-x-hidden max-md:mb-[150px]">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="edit"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>
        <UserForm user={user} />
      </div>
    </div>
  );
};

export default UpdateProfile;
