import AImessage from "../../models/AImessage.model.js";



/**
 * Single source of truth for saving messages
 */
export default async function saveChatMessage({
    convo_id,
    sender,
    content,
}) {
    try {
        const message = await AImessage.create({
            convo_id,
            sender,
            content,
        });
    }
    catch (err) {
        console.log("save msg error: " + err);
    }

    return ;
}