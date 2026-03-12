export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ClerkError = {
  errors?: Array<{ message?: string }>;
};

export function getClerkErrorMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    if ("errors" in error) {
      const clerkError = error as ClerkError;
      const message = clerkError.errors?.[0]?.message;
      if (message) return message;
    }
    if (error instanceof Error) return error.message;
  }
  return "Something went wrong. Please try again.";
}
