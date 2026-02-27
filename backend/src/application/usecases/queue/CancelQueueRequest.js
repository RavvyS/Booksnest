class CancelQueueRequest {
  constructor(queueRepository) {
    this.queueRepository = queueRepository;
  }

  async execute(userId, requestId) {
    if (!userId) throw new Error("User ID is required");
    if (!requestId) throw new Error("Queue request ID is required");

    return await this.queueRepository.cancelPendingByIdAndUser(requestId, userId);
  }
}

module.exports = CancelQueueRequest;
