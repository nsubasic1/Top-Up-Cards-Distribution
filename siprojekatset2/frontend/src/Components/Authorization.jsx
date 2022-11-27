import React from "react";

export default function Authorization(Komponenta, allowedRoles, userRole) {
  return allowedRoles.includes(userRole) ? (
    Komponenta
  ) : (
    <>
      <h1 className="text-center">Za navedenu rutu nemate pristup</h1>
    </>
  );
}
