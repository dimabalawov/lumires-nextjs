import { NotificationType } from "@/types/notification";
import LikeIcon from "../../../../public/imgs/notifications/like.svg";
import ReplyIcon from "../../../../public/imgs/notifications/reply.svg";
import UserIcon from "../../../../public/imgs/notifications/user.svg";

export const typeIcon: Record<NotificationType, { Icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string }> = {
    LikedReview:        { Icon: LikeIcon,  color: "#D2A66A" },
    LikedReviewComment: { Icon: LikeIcon,  color: "#D2A66A" },
    LikedThread:        { Icon: LikeIcon,  color: "#D2A66A" },
    LikedThreadComment: { Icon: LikeIcon,  color: "#D2A66A" },
    LikedFilmsList:     { Icon: LikeIcon,  color: "#D2A66A" },
    ReviewReplied:      { Icon: ReplyIcon, color: "#D2A66A" },
    ThreadReplied:      { Icon: ReplyIcon, color: "#D2A66A" },
    Followed:           { Icon: UserIcon,  color: "#D2A66A" },
    FollowedBack:       { Icon: UserIcon,  color: "#D2A66A" },
};