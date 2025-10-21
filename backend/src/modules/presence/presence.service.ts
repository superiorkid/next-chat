import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class PresenceService {
  private readonly logger = new Logger(PresenceService.name);
  private readonly socketToUser = new Map<string, string>();
  private readonly userToSockets = new Map<string, Set<string>>();

  constructor(private readonly userRepository: UserRepository) {}

  async setOnline(userId: string, socketId: string) {
    this.socketToUser.set(socketId, userId);

    if (!this.userToSockets.has(userId)) {
      this.userToSockets.set(userId, new Set());
    }

    this.userToSockets.get(userId)!.add(socketId);

    if (this.userToSockets.get(userId)!.size === 1) {
      await this.userRepository.update({
        where: { id: userId },
        data: { isOnline: true },
      });
      this.logger.warn(`${userId} is now online`);
    }
  }

  async setOffline(socketId: string) {
    const userId = this.socketToUser.get(socketId);
    if (!userId) return;

    this.socketToUser.delete(socketId);

    const sockets = this.userToSockets.get(userId);
    if (!sockets) return;

    sockets.delete(socketId);

    if (sockets.size === 0) {
      this.userToSockets.delete(userId);

      await this.userRepository.update({
        where: { id: userId },
        data: { isOnline: false, lastSeen: new Date() },
      });
      this.logger.warn(`${userId} is now offline`);
    }
  }

  getOnlineUsers() {
    return [...this.userToSockets.keys()];
  }

  isUserOnline(userId: string): boolean {
    return this.userToSockets.has(userId);
  }
}
