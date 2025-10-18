import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import { openAPI } from 'better-auth/plugins';
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  session: { cookieCache: { enabled: true, maxAge: 5 * 60 } },
  advanced: {
    cookiePrefix: process.env.APP_NAME,
  },
  plugins: [openAPI()],
  trustedOrigins: [process.env.FRONTEND_URL as string],
  telemetry: { debug: true },
});
