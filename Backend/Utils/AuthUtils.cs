using System.Security.Cryptography;
using System.Text;

namespace Backend.Utils;

public static class AuthUtils
{

    public static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passowordSalt)
    {
        using (var hmac = new HMACSHA512())
        {
            passowordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }
    }

    public static bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passowordSalt)
    {
        using (var hmac = new HMACSHA512(passowordSalt))
        {
            var computeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computeHash.SequenceEqual(passwordHash);
        }
    }
}