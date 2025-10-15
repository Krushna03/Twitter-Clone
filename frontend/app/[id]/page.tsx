"use client"
import TwitterLayout from "@/components/Layout/TwitterLayout";
import { useParams } from "next/navigation";

export default function DynamicPage() {
  const params = useParams();
  const { id } = params; // example: 123

  return (
    <div>
      <TwitterLayout>
        <div>
          Profile section
        </div>
      </TwitterLayout>
    </div>
  );
}
