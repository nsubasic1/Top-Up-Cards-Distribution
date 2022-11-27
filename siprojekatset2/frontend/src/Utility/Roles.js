export const adminRoles = ["admin"];
export const korisnikRoles = ["user", "admin"];
export const kreatorDistMrežeRoles = ["kreator", "admin"];
export const signedInRoles = ["admin", "user", "kreator"];
const nazivRola = ["Admin", "Korisnik", "Kreator distributivne mreže"];
export const getRoleName = (id) => {
  return nazivRola[id - 1];
};
