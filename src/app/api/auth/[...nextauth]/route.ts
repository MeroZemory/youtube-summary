import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube.readonly',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }): Promise<JWT> {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      if (token) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST }; 