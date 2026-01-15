import AImessage from "../../models/AImessage.model.js";



/**
 * Single source of truth for saving messages
 */
export default async function saveChatMessage({
    convo_id,
    sender,
    content,
    message_id,
    snapshot
}) {
    try {
        if (message_id) {
            // EDIT / VERSIONING LOGIC
            const msg = await AImessage.findById(message_id);
            if (msg) {
                // 1. Prepare versions array if empty
                // Frontend logic assumes versions includes the original message as version 0.
                if (!msg.versions || msg.versions.length === 0) {
                    msg.versions = [{
                        content: msg.content,
                        snapshot: snapshot // This snapshot is effectively the "old future" for version 0
                    }];
                } else {
                    // Ensure the *current* active version has its snapshot updated?
                    // The FE sends the *future* relative to the node being edited.
                    // Simply pushing the OLD content as a "past" version with the provided snapshot is correct for linear history?
                    // Actually, align with FE logic:
                    // FE sends the *new* content. We should archive the *old* content if not already there?
                    // No, simply push the NEW version directly.
                    // Wait, if msg.versions has [v0], and we are at v0.
                    // We edit v0 -> v1.
                    // We push v1. currentVersion = 1.

                    // Check if we need to update the snapshot of the *previous* version
                    // In FE: `versions[oldMsg.currentVersion].snapshot = futureSnapshot;`
                    // We should trust the FE to send a coherent state?
                    // No, backend must be robust.
                    // But for now, let's replicate the structure:

                    // If we are "branching", we just need to store the new version.
                    // The snapshot provided is the "future" that we are detaching.
                    // It belongs to the *previous* version (the one we are editing FROM).
                    if (typeof msg.currentVersion === 'number' && msg.versions[msg.currentVersion]) {
                        msg.versions[msg.currentVersion].snapshot = snapshot;
                    }
                }

                // 2. Add the NEW version
                msg.versions.push({
                    content: content,
                    snapshot: [] // New version has no future yet (it's the leaf)
                });

                // 3. Update main fields
                msg.content = content;
                msg.currentVersion = msg.versions.length - 1;

                await msg.save();

                // 4. Delete the "future" messages from the main timeline
                // These are now archived in the snapshot of the previous version
                if (snapshot && snapshot.length > 0) {
                    const idsToDelete = snapshot.map(s => s.id || s._id).filter(Boolean);
                    if (idsToDelete.length > 0) {
                        await AImessage.deleteMany({ _id: { $in: idsToDelete } });
                    }
                }
                return;
            }
        }

        const message = await AImessage.create({
            convo_id,
            sender,
            content,
        });
    }
    catch (err) {
        console.log("save msg error: " + err);
    }

    return;
}