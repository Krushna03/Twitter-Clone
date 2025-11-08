"use client";

import { useCurrentUser } from "@/hooks/user";
import { User } from "@/gql/graphql";
import { useCallback, useMemo } from "react";
import { graphqlClient } from "@/clients/api";
import { followUserMutation, unfollowUserMutation } from "@/graphql/mutation/user";
import { useQueryClient } from "@tanstack/react-query";

interface FollowButtonProps {
  user: User;
}

const FollowButton: React.FC<FollowButtonProps> = ({ user }) => {
  const { user: currentUser } = useCurrentUser();

  const queryClient = useQueryClient()

  const amIFollowing = useMemo(() => {
    if (!user) {
      return false;
    }
    return (currentUser?.following?.findIndex((el) => el?.id === user.id) ?? -1 ) >= 0
  }, [currentUser?.following, user])


  const handleFollowUser = useCallback(async () => {
    if(!user) return;

    await graphqlClient.request(followUserMutation, { to: user?.id })

    await queryClient.invalidateQueries({ queryKey: ['current-user'] })
  }, [user.id, queryClient])
  
  const handleUnFollowUser = useCallback(async () => {
    if(!user) return;

    await graphqlClient.request(unfollowUserMutation, { to: user?.id })

    await queryClient.invalidateQueries({ queryKey: ['current-user'] })
  }, [user.id, queryClient])

  return (
    <>
      {
        currentUser?.id !== user.id && (
          <>
          {
            amIFollowing ? (
              <button 
                onClick={handleUnFollowUser}
                className="bg-white text-black px-3 py-1 rounded-full text-sm font-semibold hover:bg-gray-200 transition cursor-pointer">
                Unfollow
              </button>
            ) : (
              <button
                onClick={handleFollowUser}
                className="bg-white text-black px-3 py-1 rounded-full text-sm font-semibold hover:bg-gray-200 transition cursor-pointer">
                Follow
              </button>
            )
          }
          </>
        )
      }
    </>
  );
};

export default FollowButton;

