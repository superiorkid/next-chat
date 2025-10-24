import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { getErrorInfo } from 'src/lib/get-error-info';
import { DatabaseService } from 'src/shared/database/database.service';
import { FileUploadService } from 'src/shared/file-upload/file-upload.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private databaseService: DatabaseService,
    private fileUploadService: FileUploadService,
  ) {}

  async getCurrentUserProfile(userId: string) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { id: userId },
      });
      if (!user) throw new NotFoundException('User not found');

      return {
        success: true,
        message: 'User profile retrieved successfully',
        data: user,
      };
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      this.logger.error(
        {
          id: 'get-current-user-error',
          userId: userId,
          error: errorInfo.message,
          stack: errorInfo.stack,
          timestamp: new Date().toISOString(),
        },
        'Failed to retrieve current user profile',
      );

      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Unable to retrieve user profile at this time',
      );
    }
  }

  async updateUserProfile(params: {
    userId: string;
    updateUserDto: UpdateUserDto;
  }) {
    const { updateUserDto, userId } = params;
    const { bio, name, newImage, removedImage } = updateUserDto;

    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    try {
      let imageUrl = user.image;
      const uploadPath = 'users/profile';

      if (removedImage && imageUrl) {
        const filename = imageUrl.split('/').pop();
        this.fileUploadService.deleteSingleFile(filename as string, uploadPath);
        imageUrl = null;
        this.logger.log(`Removed profile image for user: ${userId}`);
      }

      if (newImage) {
        if (imageUrl) {
          const oldFileName = imageUrl.split('/').pop();
          this.fileUploadService.deleteSingleFile(
            oldFileName as string,
            uploadPath,
          );
        }

        const uploaded = await this.fileUploadService.uploadSingleFile({
          file: newImage,
          subFolder: uploadPath,
        });
        imageUrl = uploaded.url;
        this.logger.log(`Uploaded new profile image for user: ${userId}`);
      }

      await this.databaseService.user.update({
        where: { id: userId },
        data: {
          name,
          bio,
          image: imageUrl,
        },
      });

      return {
        success: true,
        message: 'User profile updated successfully',
      };
    } catch (error) {
      const errorInfo = getErrorInfo(error);

      this.logger.error(
        {
          id: 'update-user-profile-error',
          userId: userId,
          error: errorInfo.message,
          stack: errorInfo.stack,
          timestamp: new Date().toISOString(),
        },
        'Failed to update user profile',
      );

      throw new InternalServerErrorException('Failed to update user profile');
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { id: userId },
      });
      if (!user) throw new NotFoundException('User not found');

      return {
        success: true,
        message: 'User profile retrieved successfully',
        data: user,
      };
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      this.logger.error(
        {
          id: 'get-user-by-id-error',
          userId: userId,
          error: errorInfo.message,
          stack: errorInfo.stack,
          timestamp: new Date().toISOString(),
        },
        `Failed to retrieve user profile for ID: ${userId}`,
      );

      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Unable to retrieve user profile at this time',
      );
    }
  }

  async getUserStatus(userId: string) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { id: userId },
        select: {
          isOnline: true,
          lastSeen: true,
        },
      });
      if (!user) throw new NotFoundException('User not found');

      return {
        success: true,
        message: 'User status retrieved successfully',
        data: user,
      };
    } catch (error) {
      const errorInfo = getErrorInfo(error);

      this.logger.error(
        {
          id: 'get-user-status-error',
          userId: userId,
          error: errorInfo.message,
          stack: errorInfo.stack,
          timestamp: new Date().toISOString(),
        },
        `Failed to retrieve user status for ID: ${userId}`,
      );

      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'An unexpected error occurred while retrieving user status',
      );
    }
  }
}
