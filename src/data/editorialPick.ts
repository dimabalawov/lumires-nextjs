import { EditorialPick } from "@/types/film";

// Demo "editorial pick" for the /threads page. No No-Country-for-Old-Men still is
// available in /public/imgs, so an existing cinematic still doubles as a placeholder,
// and reply avatars reuse the /imgs/community photo set.
export const editorialPick: EditorialPick = {
  image: "/imgs/trending/interstellar.jpg",
  title: "Is There A More Perfectly Cast Film Than No Country For Old Men?",
  body: "I've been thinking about this for weeks. Every single person in No Country for Old Men is exactly right. Javier Bardem as Chigurh is the obvious one but think about how perfect Tommy Lee Jones is as Bell. Or Woody Harrelson in what is essentially a small role but you can't imagine anyone else doing it. Even the minor characters — the hotel clerks, the gas station owner — feel like real people pulled from that world. The Coens have always been great at casting but this film is something else entirely. Name a more perfectly cast film. I don't think you can.",
  author: "velvetcinema",
  date: "MAY 02 · 2026",
  replies: "1.2k",
  views: "58.2k",
  topReplies: [
    {
      id: "reply-film-nerd92",
      username: "@film_nerd92",
      replyTo: "@lightandshadow",
      avatarUrl: "/imgs/community/cinephile.png",
      date: "MAY 02 · 2026",
      text: "The gas station scene with Chigurh and the old man is one of the greatest acted scenes in cinema history — and neither of those men is a household name. That's what makes this film different. The Coens trusted unknown faces and it paid off completely.",
      likes: "186",
    },
    {
      id: "reply-quietwatcher",
      username: "@quietwatcher",
      replyTo: "@lightandshadow",
      avatarUrl: "/imgs/community/quietobserver.png",
      date: "MAY 02 · 2026",
      text: "Javier Bardem said in an interview he never watched the finished film because he was afraid it would change how he remembered making it. That kind of commitment to a character shows in every single frame he's in.",
      likes: "186",
    },
    {
      id: "reply-lostinframes",
      username: "@lostinframes",
      replyTo: "@lightandshadow",
      avatarUrl: "/imgs/community/midnightframes.png",
      date: "MAY 02 · 2026",
      text: "Watched it again last night specifically because of this thread. The scene where Bell visits the motel room at the end and the door is slightly open and he just sits there. Tommy Lee Jones does nothing and it is one of the saddest moments I have ever seen in a film.",
      likes: "186",
    },
  ],
};
