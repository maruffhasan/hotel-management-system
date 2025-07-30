//login error text generator
const API = "http://localhost:8080"; // Centralized API base URL

export const getHotelInfo = async () => {
  const response = await fetch(`${API}/api/hotel/details`);

  try{
    if(!response.ok)
        throw new Error("Error fetching hotel info");

    return await response.json();
  }
  catch(err)
  {
    console.log(err);
    throw err;
  }
};


export const getErrorMessageByStatus = async(status) => {
  if (!status) return "An unexpected error occurred. Please try again.";

  
    const response = await getHotelInfo();


  const messages = {
    400: "Bad request. Please check your input.",
    401: "Invalid credentials, please try again ...",
    403: "You are temporarily banned, please contact with our support team \n" + response.email,
    404: "Requested resource not found.",
    500: "Internal server error. Please try again later.",
    503: "Server is currently unavailable. Try again soon.",
  };

  return messages[status] || `Unexpected error (status ${status}). Please try again.`;
};
