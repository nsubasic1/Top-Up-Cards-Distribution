import jwt_decode from "jwt-decode";
export const isLoggedIn = () => {
  return localStorage.getItem("token") != null;
};
export const getRole = () => {
  var token = localStorage.getItem("token");
  if (!token) return "Guest";
  var decoded = jwt_decode(token);

  return decoded[
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
  ];
};
export const isAdmin = () => {
  return getRole() == "admin";
};
export const getEmail = () => {
  var token = localStorage.getItem("token");
  if (!token) return "Not";
  var decoded = jwt_decode(token);
  return decoded[
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
  ];
}
