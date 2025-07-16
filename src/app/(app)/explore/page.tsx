"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PiArrowFatUpLight, PiArrowFatUpFill } from "react-icons/pi";
import { FiMessageCircle } from "react-icons/fi";

interface Scam {
  id: string | number;
  title: string;
  scamType: string;
  shortDescription: string;
  longDescription: string;
}
interface LikeData {
  isLiked: boolean;
  count: number;
}
interface Message {
  id: number;
  text: string;
  replies: Reply[];
}
interface Reply {
  text: string;
}

const Explore = () => {
  const [results, setResults] = useState<Scam[]>([]);
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState<{ [key: string]: LikeData }>({});
  const [discussions, setDiscussions] = useState<{ [key: string]: Message[] }>({});
  const [input, setInput] = useState("");
  const [replyInput, setReplyInput] = useState<{ [key: number]: string }>({});
  // Removed unused: activeDiscussionId

  const fetchScams = async () => {
    try {
      setLoading(true);
      const res = await axios.get("api/get-scams");

      const storedLikes = JSON.parse(localStorage.getItem("likes") || "{}");
      const storedDiscussions = JSON.parse(localStorage.getItem("discussions") || "{}");

      setResults(res.data.data);
      setLikes(storedLikes);
      setDiscussions(storedDiscussions);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching scams:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScams();
  }, []);

  const handleLike = (id: string | number) => {
    setLikes((prev) => {
      const current = prev[id] || { isLiked: false, count: 0 };
      const updated = {
        ...prev,
        [id]: {
          isLiked: !current.isLiked,
          count: current.count + (current.isLiked ? -1 : 1),
        },
      };
      localStorage.setItem("likes", JSON.stringify(updated));
      return updated;
    });
  };

  const postMessage = (id: string | number) => {
    if (!input.trim()) return;
    const newMessage = { id: Date.now(), text: input, replies: [] };
    const updated = {
      ...discussions,
      [id]: [...(discussions[id] || []), newMessage],
    };
    setDiscussions(updated);
    localStorage.setItem("discussions", JSON.stringify(updated));
    setInput("");
  };

  const postReply = (scamId: string | number, messageId: number) => {
    const reply = replyInput[messageId];
    if (!reply?.trim()) return;

    const updatedMessages = discussions[scamId].map((msg: Message) =>
      msg.id === messageId
        ? { ...msg, replies: [...msg.replies, { text: reply }] }
        : msg
    );

    const updated = { ...discussions, [scamId]: updatedMessages };
    setDiscussions(updated);
    localStorage.setItem("discussions", JSON.stringify(updated));
    setReplyInput({ ...replyInput, [messageId]: "" });
  };

  return (
    <div>
      <p className="font-bold text-3xl p-3 text-center text-blue-400">Explore More 🔎</p>
      {loading && <div className="text-center m-2">Loading...</div>}

      <div className="flex flex-col justify-center">
        {results.map((item, index) => {
          const itemId = item.id || index;
          const likeData = likes[itemId] || { isLiked: false, count: 0 };

          return (
            <div
              key={itemId}
              className="relative mx-10 my-5 p-8 border rounded-xl text-white"
            >
              <p className="font-semibold text-xl">{item.title}</p>
              <p className="text-blue-400">Scam Type - {item.scamType}</p>
              <p className="text-zinc-300 mt-2">{item.shortDescription}</p>

              <div className="flex gap-4 mt-4 items-center flex-wrap">
                {/* Like Button */}
                <button
                  onClick={() => handleLike(itemId)}
                  className="flex items-center gap-2 hover:text-green-400 transition-colors"
                >
                  {likeData.isLiked ? (
                    <PiArrowFatUpFill size={22} />
                  ) : (
                    <PiArrowFatUpLight size={22} />
                  )}
                  <span className="text-sm">{likeData.count} found this useful</span>
                </button>

                {/* Discuss Button */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      // onClick removed: setActiveDiscussionId was unused and removed for TS compliance
                      className="flex items-center gap-2 hover:text-purple-500 text-white px-3 py-1 rounded-md transition-all"
                    >
                      <FiMessageCircle size={18} />
                      Discuss
                    </button>
                  </DialogTrigger>
                  <DialogContent className="p-6 rounded-xl text-white max-w-xl mx-auto">
                    <DialogHeader>
                      <DialogTitle className="text-lg">{item.title}</DialogTitle>
                      <DialogDescription className="text-zinc-300">
                        Have something to say or reply to others.
                      </DialogDescription>
                    </DialogHeader>

                    {/* Discussion Messages */}
                    <div className="mt-4 max-h-60 overflow-y-auto space-y-4">
                      {(discussions[itemId] || []).map((msg) => (
                        <div key={msg.id} className="bg-zinc-800 p-3 rounded-lg">
                          <p className="text-sm text-white">{msg.text}</p>

                          {/* Replies */}
                          <div className="ml-4 mt-2 space-y-1">
                            {msg.replies.map((rep: Reply, idx: number) => (
                              <p key={idx} className="text-sm text-zinc-300 bg-zinc-900 p-2 rounded">
                                ↳ {rep.text}
                              </p>
                            ))}
                          </div>

                          {/* Reply Input */}
                          <div className="flex mt-2 gap-2">
                            <input
                              type="text"
                              placeholder="Write a reply..."
                              value={replyInput[msg.id] || ""}
                              onChange={(e) =>
                                setReplyInput({ ...replyInput, [msg.id]: e.target.value })
                              }
                              className="flex-1 bg-black text-white border px-2 py-1 rounded-md"
                            />
                            <button
                              onClick={() => postReply(itemId, msg.id)}
                              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md transition-all"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* New Message Input */}
                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="Write a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full bg-black text-white border border-blue-600 px-3 py-2 rounded-md"
                      />
                      <button
                        onClick={() => postMessage(itemId)}
                        className="mt-2 w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-md transition-all"
                      >
                        Post Message
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Read More Button */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="hover:text-blue-500 text-white px-3 py-1 rounded-md transition-all">
                      Read more
                    </button>
                  </DialogTrigger>
                  <DialogContent className="p-5 rounded-xl text-white">
                    <DialogHeader>
                      <DialogTitle className="text-lg">{item.title}</DialogTitle>
                      <DialogDescription className="mt-3 text-sm text-white">
                        <p>{item.longDescription}</p>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Explore;
