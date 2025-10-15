import { graphqlClient } from "@/clients/api";
import FeedCard from "@/components/FeedCard";
import TwitterLayout from "@/components/Layout/TwitterLayout";
import { Tweet, User } from "@/gql/graphql";
import { getUserByIdQuery } from "@/graphql/query/user";
import Image from "next/image";
import { BsArrowLeftShort } from "react-icons/bs";
import Link from "next/link";

interface PageProps {
  params: { id: string };
}

const UserPage = async ({ params }: PageProps) => {
  const id = params.id;

  const userInfo = await graphqlClient.request(getUserByIdQuery, { id });
  const user = userInfo?.getUserById as User | null;

  if (!user) {
    return (
      <TwitterLayout>
        <div className="text-center p-10 text-gray-400">User not found</div>
      </TwitterLayout>
    );
  }

  return (
    <TwitterLayout>
      <div>
        <nav className="flex items-center gap-3 py-4 px-3">
          <Link href="/">
            <BsArrowLeftShort className="text-4xl cursor-pointer" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">{user.firstName} {user.lastname}</h1>
            <h1 className="text-md font-bold text-slate-500">
              {user.tweets?.length} Tweets
            </h1>
          </div>
        </nav>

        <div className="p-4 border-b border-slate-800">
          {user.profileImage && (
            <Image
              src={user.profileImage}
              alt="user-image"
              className="rounded-full"
              height={100}
              width={100}
            />
          )}
          <h1 className="text-xl font-bold mt-2">
            {user.firstName} {user.lastname}
          </h1>
        </div>

        <div>
          {user.tweets?.map((tweet) => (
            <FeedCard data={tweet as Tweet} key={tweet?.id} />
          ))}
        </div>
      </div>
    </TwitterLayout>
  );
};

export default UserPage;
