"use client";

import { useCurrentUser } from "@/hooks/user";
import { User } from "@/gql/graphql";

interface FollowButtonProps {
  user: User;
}

const FollowButton: React.FC<FollowButtonProps> = ({ user }) => {
  const { user: currentUser } = useCurrentUser();

  // Don't show button if viewing own profile or not logged in
  if (!currentUser || currentUser.id === user.id) {
    return null;
  }

  return (
    <button className="bg-white text-black px-3 py-1 rounded-full text-sm font-semibold hover:bg-gray-200 transition">
      Follow
    </button>
  );
};

export default FollowButton;

