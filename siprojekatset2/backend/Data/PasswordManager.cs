namespace backend.Data
{
    public class PasswordManager
    {
        public static string EncodePassword(string password)
        {
            string encoded = "";
            for (int i = 0; i < password.Length; i++)
            {
                encoded += (char)(password[i] + 1);
            }
            for (int i = 0; i < password.Length; i++)
            {
                encoded += (char)(password[i] - 1);
            }
            return encoded;
        }

        public static string DecodePassword(string encoded)
        {
            string decoded = "";
            for (int i = 0; i < encoded.Length / 2; i++)
            {
                decoded += (char)(encoded[i] - 1);
            }
            return decoded;
        }

        public static List<Korisnik> EncodeUserListPassword(List<Korisnik> korisnici)
        {
            korisnici.ForEach(k =>
            {
                k.password = EncodePassword(k.password);
            });
            return korisnici;
        }

        public static List<Korisnik> DecodeUserListPassword(List<Korisnik> korisnici)
        {
            korisnici.ForEach(k =>
            {
                k.password = DecodePassword(k.password);
            });
            return korisnici;
        }

        public static string GnerateRandomString()
        {
            Random random = new Random();
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
            return new string(Enumerable.Repeat(chars, 20)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
