import { Socket } from 'socket.io';
import { AccessTokenPayloadType } from './access-token-payload.type';

export interface AuthenticatedSocket extends Socket {
  user?: AccessTokenPayloadType;
}
