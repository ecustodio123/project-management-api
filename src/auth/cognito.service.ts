import { Injectable } from '@nestjs/common';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

@Injectable()
export class CognitoService {
  private accessTokenVerifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID!,
    tokenUse: 'access',
    clientId: process.env.COGNITO_CLIENT_ID!,
  });

  private idTokenVerifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID!,
    tokenUse: 'id',
    clientId: process.env.COGNITO_CLIENT_ID!,
  });

  verifyAccessToken(token: string) {
    return this.accessTokenVerifier.verify(token);
  }

  verifyIdToken(token: string) {
    return this.idTokenVerifier.verify(token);
  }
}
