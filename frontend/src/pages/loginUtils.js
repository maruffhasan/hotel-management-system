//login error text generator
export const getErrorMessageByStatus = (status) => {
  if (!status) return "An unexpected error occurred. Please try again.";

  const messages = {
    400: "Bad request. Please check your input.",
    401: "Unauthorized. Please log in again.",
    403: "You do not have permission to access this resource.",
    404: "Requested resource not found.",
    500: "Internal server error. Please try again later.",
    503: "Server is currently unavailable. Try again soon.",
  };

  return messages[status] || `Unexpected error (status ${status}). Please try again.`;
};
