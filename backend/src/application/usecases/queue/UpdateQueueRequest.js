
//  Implements a single business use case with domain-focused rules.

class UpdateQueueRequest {
  constructor(queueRepository) {
    this.queueRepository = queueRepository;
  }

  async execute(userId, requestId, payload = {}) {
    if (!userId) throw new Error("User ID is required");
    if (!requestId) throw new Error("Queue request ID is required");
    if (payload.note === undefined) {
      throw new Error("note is required");
    }

    const note = String(payload.note).trim();

    return await this.queueRepository.updatePendingByIdAndUser(
      requestId,
      userId,
      { note },
    );
  }
}

module.exports = UpdateQueueRequest;
