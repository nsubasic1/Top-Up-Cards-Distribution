export const getLogs = async () => {
  let token = "bearer " + localStorage.getItem("token");
  const response = await fetch("api/Logs/get", {
    headers: { Authorization: token },
  });

  return await response.json();
};
