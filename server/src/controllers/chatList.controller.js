import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Lawyer from "../models/lawyer.model.js";
import mongoose from "mongoose";

/**
 * GET /api/chat/list
 * Returns list of chats for logged-in user
 */
export async function getChatList(req, res) {
  try {
    const userId = req.client_data.id;
    const role = req.client_data.user_type;

   

    // Convert userId to ObjectId for proper comparison
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const chats = await Message.aggregate([
      // 1️⃣ Only messages involving current user
      {
        $match: {
          $or: [
            { sender_id: userObjectId },
            { receiver_id: userObjectId },
          ],
        },
      },

      // 2️⃣ Identify the other participant
      {
        $addFields: {
          otherUserId: {
            $cond: [
              { $eq: ["$sender_id", userObjectId] },
              "$receiver_id",
              "$sender_id",
            ],
          },
        },
      },

      // 3️⃣ Group by other participant FIRST (before sorting)
      {
        $group: {
          _id: "$otherUserId",
          lastMessage: { $last: "$content" }, // Get most recent
          lastMessageAt: { $max: "$createdAt" }, // Most recent timestamp
          lastMessageSender: { 
            $first: {
              $cond: [
                { $eq: [{ $max: "$createdAt" }, "$createdAt"] },
                "$sender_id",
                null
              ]
            }
          },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiver_id", userObjectId] },
                    { $eq: ["$read_at", null] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      // 4️⃣ Sort chats by most recent message
      { $sort: { lastMessageAt: -1 } },
    ]);

    // console.log(`📊 Found ${chats.length} chat threads`);

    // 5️⃣ Populate profile info (role-aware)
    const results = await Promise.all(
      chats.map(async (chat) => {
        try {
          let profile;

          if (role === "User") {
            // User is chatting with Lawyer
            profile = await Lawyer.findById(chat._id).select(
              "first_name last_name profile_picture"
            );
          } else {
            // Lawyer is chatting with User
            profile = await User.findById(chat._id).select(
              "first_name last_name profile_picture"
            );
          }

          if (!profile) {
            console.log(`⚠️ Profile not found for ID: ${chat._id}`);
            return {
              userId: chat._id,
              first_name: "Unknown",
              last_name: "User",
              profile_pic: "",
              lastMessage: chat.lastMessage || "",
              lastMessageAt: chat.lastMessageAt,
              unreadCount: chat.unreadCount || 0,
              isLastMessageFromMe: chat.lastMessageSender?.equals(userObjectId) || false,
            };
          }

          return {
            userId: chat._id,
            first_name: profile.first_name || "",
            last_name: profile.last_name || "",
            profile_pic: profile.profile_picture || "",
            lastMessage: chat.lastMessage || "",
            lastMessageAt: chat.lastMessageAt,
            unreadCount: chat.unreadCount || 0,
            isLastMessageFromMe: chat.lastMessageSender?.equals(userObjectId) || false,
          };
        } catch (err) {
          console.log(`Error populating chat ${chat._id}:`, err);
          return null;
        }
      })
    );

    // Filter out null results
    const filteredResults = results.filter(chat => chat !== null);

   

    res.json(filteredResults);
  } catch (err) {
    console.log("Chat list error:", err);
    res.status(500).json({ 
      error: "Server error",
      message: err.message 
    });
  }
}