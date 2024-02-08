"use server";

import { signIn } from "@/auth";
import { $LogInSchema, LogInSchema } from "@/lib/validation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import prisma from "@/lib/prisma";
import { convertToE164 } from "@/lib/utils";
import vonage from "@/lib/vonage";
import { Channels } from "@vonage/verify2";

export async function logInAction(formData: LogInSchema, callbackUrl?: string | null) {
  const validatedFields = $LogInSchema.safeParse(formData);

  if (!validatedFields.success) return { error: "Invalid fields" };

  const { email, phone, code } = validatedFields.data;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { phone }],
    },
  });

  if (!user) return { error: "Invalid credentials" };

  let to, channel;
  if (email) {
    to = email;
    channel = Channels.EMAIL;
  } else if (phone) {
    to = convertToE164(phone);
    channel = Channels.SMS;
  } else {
    return { error: "Hmm, refresh and try again?" };
  }

  if (!code) {
    try {
      if (user.verifyRequestId) {
        await vonage.verify2.cancel(user.verifyRequestId).catch();

        await prisma.user.update({
          where: { id: user.id },
          data: { verifyRequestId: null },
        });
      }

      const { requestId } = await vonage.verify2.newRequest({
        brand: "TODO App",
        workflow: [{ channel, to }],
        channelTimeout: 300,
        codeLength: 4,
      });

      await prisma.user.update({
        where: { id: user.id },
        data: {
          verifyRequestId: requestId,
        },
      });
    } catch (e: any) {
      if (!e.response || !e.response.status) return { error: "Something went really wrong" };

      switch (e.response.status) {
        case 409: // Should never show
          return { error: "Concurrent verifications to the same number are not allowed" };
        case 422: // Should never show
          return { error: "The value of one or more parameters is invalid" };
        case 429:
          return { error: "Please wait, then retry your request" };
        default:
          return { error: "Something went really wrong" };
      }
    }

    return { twoFactor: true };
  }

  if (!user.verifyRequestId) return { error: "what?" };

  try {
    const status = await vonage.verify2.checkCode(user.verifyRequestId, code);
    if (status != "completed") throw Error();
  } catch (e: any) {
    if (!e.response || !e.response.status) return { error: "Something went really wrong" };

    switch (e.response.status) {
      case 400:
        return { error: "Invalid Code" };
      case 404:
        return { error: "Token Expired" };
      case 409:
        return { error: "The current Verify workflow step does not support a code" };
      case 410:
        return { error: "Too Many Tries, refresh and try again" };
      case 429:
        return { error: "Rate Limit Hit, try again later" };
      default:
        return { error: "Token Expired" };
    }
  }

  const nowDate = new Date();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(email ? { lastEmailLogin: nowDate } : {}),
      ...(phone ? { lastPhoneLogin: nowDate } : {}),
      loginVerified: new Date(nowDate.getTime() + 300 * 1000),
    },
  });

  try {
    await signIn("credentials", {
      email,
      phone,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }

    throw error;
  }
}
