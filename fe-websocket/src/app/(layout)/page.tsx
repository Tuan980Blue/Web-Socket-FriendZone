import React from "react";
import { Metadata, Viewport } from "next";
import Home from "@/app/(layout)/home/page";

export const metadata: Metadata = {
    title: "FriendZone - Mạng xã hội kết nối bạn bè",
    description:
        "FriendZone là mạng xã hội hiện đại giúp bạn dễ dàng kết nối, chia sẻ và trò chuyện với bạn bè mọi lúc mọi nơi.",
    keywords:
        "FriendZone, mạng xã hội, kết bạn, trò chuyện, kết nối, chia sẻ, bạn bè, chat, social network, friend connect",
    authors: [{ name: "Tuan Anh Jr" }],
    creator: "Tuan Anh Jr",
    publisher: "FriendZone Inc.",
    robots: "index, follow",
    viewport: "width=device-width, initial-scale=1",
    openGraph: {
        title: "FriendZone - Kết nối bạn bè theo cách của bạn",
        description:
            "Tham gia FriendZone để mở rộng mối quan hệ, tìm kiếm bạn bè mới và chia sẻ khoảnh khắc đáng nhớ.",
        url: "https://friendzone.social",
        siteName: "FriendZone",
        images: [
            {
                url: "https://friendzone.social/assets/og-image.png",
                width: 1200,
                height: 630,
                alt: "FriendZone Social Preview",
            },
        ],
        locale: "vi_VN",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "FriendZone - Mạng xã hội của thế hệ mới",
        description: "Chia sẻ khoảnh khắc, kết nối bạn bè và tạo nên câu chuyện riêng của bạn trên FriendZone.",
        images: ["https://friendzone.social/assets/og-image.png"],
    },
    alternates: {
        canonical: "https://friendzone.social",
    },
    metadataBase: new URL("https://friendzone.social"),
};

export const viewport: Viewport = {
    themeColor: "#C13584", // Tông màu cảm hứng từ Instagram / mạng xã hội
    width: "device-width",
    initialScale: 1,
};

function Page() {
    return (
        <div>
            <Home />
        </div>
    );
}

export default Page;
