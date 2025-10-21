import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class PresenceService {
  private readonly logger = new Logger(PresenceService.name);
  private readonly onlineUsers = new Map<string, string>();

  constructor(private userRepository: UserRepository) {}

  async setOnline(userId: string, socketId: string) {
    this.onlineUsers.set(socketId, userId);
    await this.userRepository.update({
      where: { id: userId },
      data: { isOnline: true },
    });
  }

  async setOffline(socketId: string) {
    const userId = this.onlineUsers.get(socketId);
    if (!userId) return;

    this.onlineUsers.delete(socketId);

    const stillConnected = [...this.onlineUsers.values()].includes(userId);
    if (!stillConnected) {
      await this.userRepository.update({
        where: { id: userId },
        data: { isOnline: false, lastSeen: new Date() },
      });
      this.logger.log(`User ${userId}  went offline`);
    }
  }

  getOnlineUsers() {
    return [...new Set(this.onlineUsers.values())];
  }
}
