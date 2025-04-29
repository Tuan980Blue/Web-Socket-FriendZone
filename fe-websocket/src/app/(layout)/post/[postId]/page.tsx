import PostPageClient from "@/app/(layout)/post/[postId]/PostPageClient";

type Props = {
    params: Promise<{ postId: string }>;
};

export default async function PostPage({ params }: Props) {
    const { postId } = await params;
    return <PostPageClient postId={postId} />;
}