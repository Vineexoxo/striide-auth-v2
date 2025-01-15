import { supabase } from "@/lib/supabase";

// Define the response structure for session check
interface SessionResponse {
  status: number;
  message: string;
  session: object | null;
  error?: string;
}

/**
 * Checks if a session exists and provides detailed logs.
 * @returns {Promise<SessionResponse>}
 */
export async function checkSession(): Promise<SessionResponse> {
  try {
    // Test session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    console.log("Session check:", { sessionData, sessionError });

    if (sessionError || !sessionData.session) {
      console.log("Session not active:", sessionError);
      return {
        status: 401,
        message: "Session not active",
        session: null,
        error: sessionError?.message || "Unknown error",
      };
    }

    console.log("Session created successfully:", sessionData.session);
    return {
      status: 200,
      message: "Session active",
      session: sessionData.session,
    };
  } catch (error: unknown) {
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("Error during session check:", error);
    return {
      status: 500,
      message: "Error checking session",
      session: null,
      error: errorMessage,
    };
  }
}
