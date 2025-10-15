import { graphqlClient } from "@/clients/api";
import { getAllTweetsQuery } from "@/graphql/query/tweet";
import { Tweet } from "@/gql/graphql";
import HomeClient from "../components/HomeClient";

const HomePage = async () => {
  
  const { getAllTweets } = await graphqlClient.request(getAllTweetsQuery);
  const tweets = getAllTweets as Tweet[];

  return <HomeClient tweets={tweets} />;
};

export default HomePage;
