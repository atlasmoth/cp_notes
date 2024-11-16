"use client";

import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";

interface GoogleUserProfile {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

export const AuthProvider: React.FC<any> = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      {children}
    </GoogleOAuthProvider>
  );
};

export const useLogin = () => {
  const [profile, setProfile] = useState<GoogleUserProfile | null>(() =>
    JSON.parse(localStorage.getItem("NOTES_APP_V0") || "null")
  );
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { data } = await axios.get<GoogleUserProfile>(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        localStorage.setItem("NOTES_APP_V0", JSON.stringify(data, null, 2));
        setProfile(data);
      } catch (error) {
        console.log(error);
      }
    },
    scope:
      "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
  });
  const logout = () => {
    setProfile(null);
    localStorage.removeItem("NOTES_APP_V0");
  };

  return { profile, login, logout };
};
