#pragma warning disable IDE0060

using Neo.Cryptography.ECC;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Attributes;
using Neo.SmartContract.Framework.Native;
using Neo.SmartContract.Framework.Services;
using System;
using System.ComponentModel;
using System.Numerics;

namespace Neo.SmartContract
{
    [ManifestExtra("Author", "The Neo Project")]
    [ManifestExtra("Email", "dev@neo.org")]
    [ManifestExtra("Description", "Neo Name Service")]
    [SupportedStandards("NEP-11")]
    [ContractPermission("*", "onNEP11Payment")]
    [ContractSourceCode("https://github.com/neo-project/non-native-contracts")]
    public sealed class NameService : Framework.SmartContract
    {
        public delegate void OnTransferDelegate(UInt160 from, UInt160 to, BigInteger amount, ByteString tokenId);
        public delegate void OnSetAdminDelegate(string name, UInt160 oldAdmin, UInt160 newAdmin);
        public delegate void OnRenewDelegate(string name, BigInteger oldExpiration, BigInteger newExpiration);

        [DisplayName("Transfer")]
        public static event OnTransferDelegate OnTransfer;
        [DisplayName("SetAdmin")]
        public static event OnSetAdminDelegate OnSetAdmin;
        [DisplayName("Renew")]
        public static event OnRenewDelegate OnRenew;

        private const byte Prefix_TotalSupply = 0x00;
        private const byte Prefix_Balance = 0x01;
        private const byte Prefix_AccountToken = 0x02;
        private const byte Prefix_RegisterPrice = 0x11;
        private const byte Prefix_Root = 0x20;
        private const byte Prefix_Name = 0x21;
        private const byte Prefix_Record = 0x22;

        private const int NameMaxLength = 255;
        private const ulong OneYear = 365ul * 24 * 3600 * 1000;
        private const ulong TenYears = OneYear * 10;

        [Safe]
        public static string Symbol() => "NNS";

        [Safe]
        public static byte Decimals() => 0;

        [Safe]
        public static BigInteger TotalSupply() => (BigInteger)Storage.Get(Storage.CurrentContext, new byte[] { Prefix_TotalSupply });

        [InitialValue("Nj39M97Rk2e23JiULBBMQmvpcnKaRHqxFf", ContractParameterType.Hash160)]
        private static readonly UInt160 PreRegistrationOwner = default;

        [Safe]
        public static UInt160 OwnerOf(ByteString tokenId)
        {
            StorageMap nameMap = new(Storage.CurrentContext, Prefix_Name);
            NameState token = (NameState)StdLib.Deserialize(nameMap[GetKey(tokenId)]);
            token.EnsureNotExpired();
            return token.Owner;
        }

        [Safe]
        public static Map<string, object> Properties(ByteString tokenId)
        {
            StorageMap nameMap = new(Storage.CurrentContext, Prefix_Name);
            NameState token = (NameState)StdLib.Deserialize(nameMap[GetKey(tokenId)]);
            token.EnsureNotExpired();
            Map<string, object> map = new();
            map["name"] = token.Name;
            map["expiration"] = token.Expiration;
            map["admin"] = token.Admin;
            map["image"] = "https://neo3.azureedge.net/images/neons.png";
            return map;
        }

        [Safe]
        public static BigInteger BalanceOf(UInt160 owner)
        {
            if (owner is null || !owner.IsValid)
                throw new Exception("The argument \"owner\" is invalid.");
            StorageMap balanceMap = new(Storage.CurrentContext, Prefix_Balance);
            return (BigInteger)balanceMap[owner];
        }

        [Safe]
        public static Iterator Tokens()
        {
            StorageMap nameMap = new(Storage.CurrentContext, Prefix_Name);
            return nameMap.Find(FindOptions.ValuesOnly | FindOptions.DeserializeValues | FindOptions.PickField1);
        }

        [Safe]
        public static Iterator TokensOf(UInt160 owner)
        {
            if (owner is null || !owner.IsValid)
                throw new Exception("The argument \"owner\" is invalid.");
            StorageMap accountMap = new(Storage.CurrentContext, Prefix_AccountToken);
            return accountMap.Find(owner, FindOptions.ValuesOnly);
        }

        public static bool Transfer(UInt160 to, ByteString tokenId, object data)
        {
            if (to is null || !to.IsValid)
                throw new Exception("The argument \"to\" is invalid.");
            StorageContext context = Storage.CurrentContext;
            StorageMap balanceMap = new(context, Prefix_Balance);
            StorageMap accountMap = new(context, Prefix_AccountToken);
            StorageMap nameMap = new(context, Prefix_Name);
            ByteString tokenKey = GetKey(tokenId);
            ByteString tokenBytes = nameMap[tokenKey];
            if (tokenBytes is null) throw new InvalidOperationException("Unknown token.");
            NameState token = (NameState)StdLib.Deserialize(tokenBytes);
            token.EnsureNotExpired();
            UInt160 from = token.Owner;
            if (!Runtime.CheckWitness(from)) return false;
            if (from != to)
            {
                //Update token info
                token.Owner = to;
                token.Admin = null;
                nameMap[tokenKey] = StdLib.Serialize(token);

                //Update from account
                BigInteger balance = (BigInteger)balanceMap[from];
                balance--;
                if (balance.IsZero)
                    balanceMap.Delete(from);
                else
                    balanceMap.Put(from, balance);
                accountMap.Delete(from + tokenKey);

                //Update to account
                balance = (BigInteger)balanceMap[to];
                balance++;
                balanceMap.Put(to, balance);
                accountMap[to + tokenKey] = tokenId;
            }
            PostTransfer(from, to, tokenId, data);
            return true;
        }

        public static void Update(ByteString nef, string manifest)
        {
            CheckCommittee();
            ContractManagement.Update(nef, manifest);
        }

        public static void AddRoot(string root)
        {
            CheckCommittee();
            if (!CheckFragment(root, true))
                throw new FormatException("The format of the root is incorrect.");
            StorageMap rootMap = new(Storage.CurrentContext, Prefix_Root);
            if (rootMap[root] is not null)
                throw new InvalidOperationException("The root already exists.");
            rootMap.Put(root, 0);
        }

        [Safe]
        public static Iterator Roots()
        {
            StorageMap rootMap = new(Storage.CurrentContext, Prefix_Root);
            return rootMap.Find(FindOptions.KeysOnly | FindOptions.RemovePrefix);
        }

        public static void SetPrice(long[] priceList)
        {
            CheckCommittee();
            if (priceList.Length == 0)
                throw new Exception("The price list must contain at least 1 item.");
            if (priceList[0] == -1)
                throw new Exception("The price is out of range.");
            foreach (long price in priceList)
                if (price < -1 || price > 10000_00000000)
                    throw new Exception("The price is out of range.");
            Storage.Put(Storage.CurrentContext, new byte[] { Prefix_RegisterPrice }, StdLib.Serialize(priceList));
        }

        [Safe]
        public static long GetPrice(byte length)
        {
            if (length == 0) throw new Exception("Length cannot be 0.");
            long[] priceList = (long[])StdLib.Deserialize(Storage.Get(Storage.CurrentContext, new byte[] { Prefix_RegisterPrice }));
            if (length >= priceList.Length) length = 0;
            return priceList[length];
        }

        [Safe]
        public static bool IsAvailable(string name)
        {
            StorageContext context = Storage.CurrentContext;
            StorageMap rootMap = new(context, Prefix_Root);
            StorageMap nameMap = new(context, Prefix_Name);
            string[] fragments = SplitAndCheck(name, false);
            if (fragments is null) throw new FormatException("The format of the name is incorrect.");
            if (rootMap[fragments[^1]] is null) throw new Exception("The root does not exist.");
            long price = GetPrice((byte)fragments[0].Length);
            if (price < 0) return false;
            ByteString buffer = nameMap[GetKey(name)];
            if (buffer is null) return true;
            NameState token = (NameState)StdLib.Deserialize(buffer);
            return Runtime.Time >= token.Expiration;
        }

        public static bool Register(string name, UInt160 owner)
        {
            StorageContext context = Storage.CurrentContext;
            StorageMap balanceMap = new(context, Prefix_Balance);
            StorageMap accountMap = new(context, Prefix_AccountToken);
            StorageMap rootMap = new(context, Prefix_Root);
            StorageMap nameMap = new(context, Prefix_Name);
            string[] fragments = SplitAndCheck(name, false);
            if (fragments is null) throw new FormatException("The format of the name is incorrect.");
            if (rootMap[fragments[^1]] is null) throw new Exception("The root does not exist.");
            if (!Runtime.CheckWitness(owner)) throw new InvalidOperationException("No authorization.");
            long price = GetPrice((byte)fragments[0].Length);
            if (price < 0)
                CheckCommittee();
            else
                Runtime.BurnGas(price);
            ByteString tokenKey = GetKey(name);
            ByteString buffer = nameMap[tokenKey];
            NameState token;
            UInt160 oldOwner = null;
            if (buffer is not null)
            {
                token = (NameState)StdLib.Deserialize(buffer);
                if (Runtime.Time < token.Expiration) return false;
                oldOwner = token.Owner;
                BigInteger balance = (BigInteger)balanceMap[oldOwner];
                balance--;
                if (balance.IsZero)
                    balanceMap.Delete(oldOwner);
                else
                    balanceMap.Put(oldOwner, balance);
                accountMap.Delete(oldOwner + tokenKey);

                //clear records
                StorageMap recordMap = new(context, Prefix_Record);
                var allrecords = (Iterator<ByteString>)recordMap.Find(tokenKey, FindOptions.KeysOnly);
                foreach (var key in allrecords)
                {
                    Storage.Delete(context, key);
                }
            }
            else
            {
                byte[] key = new byte[] { Prefix_TotalSupply };
                BigInteger totalSupply = (BigInteger)Storage.Get(context, key);
                Storage.Put(context, key, totalSupply + 1);
            }
            token = new()
            {
                Owner = owner,
                Name = name,
                Expiration = Runtime.Time + OneYear
            };
            nameMap[tokenKey] = StdLib.Serialize(token);
            BigInteger ownerBalance = (BigInteger)balanceMap[owner];
            ownerBalance++;
            balanceMap.Put(owner, ownerBalance);
            accountMap[owner + tokenKey] = name;
            PostTransfer(oldOwner, owner, name, null);
            return true;
        }

        public static ulong Renew(string name)
        {
            return Renew(name, 1);
        }

        public static ulong Renew(string name, byte years)
        {
            if (years < 1 || years > 10) throw new ArgumentException("The argument `years` is out of range.");
            if (name.Length > NameMaxLength) throw new FormatException("The format of the name is incorrect.");
            string[] fragments = SplitAndCheck(name, false);
            if (fragments is null) throw new FormatException("The format of the name is incorrect.");
            long price = GetPrice((byte)fragments[0].Length);
            if (price < 0)
                CheckCommittee();
            else
                Runtime.BurnGas(price * years);
            StorageMap nameMap = new(Storage.CurrentContext, Prefix_Name);
            ByteString tokenKey = GetKey(name);
            NameState token = (NameState)StdLib.Deserialize(nameMap[tokenKey]);
            token.EnsureNotExpired();
            ulong oldExpiration = token.Expiration;
            token.Expiration += OneYear * years;
            if (token.Expiration > Runtime.Time + TenYears)
                throw new ArgumentException("You can't renew a domain name for more than 10 years in total.");
            nameMap[tokenKey] = StdLib.Serialize(token);
            OnRenew(name, oldExpiration, token.Expiration);
            return token.Expiration;
        }

        public static void SetAdmin(string name, UInt160 admin)
        {
            if (name.Length > NameMaxLength) throw new FormatException("The format of the name is incorrect.");
            if (admin is not null && !Runtime.CheckWitness(admin)) throw new InvalidOperationException("No authorization.");
            StorageMap nameMap = new(Storage.CurrentContext, Prefix_Name);
            ByteString tokenKey = GetKey(name);
            NameState token = (NameState)StdLib.Deserialize(nameMap[tokenKey]);
            token.EnsureNotExpired();
            if (!Runtime.CheckWitness(token.Owner)) throw new InvalidOperationException("No authorization.");
            UInt160 old = token.Admin;
            token.Admin = admin;
            nameMap[tokenKey] = StdLib.Serialize(token);
            OnSetAdmin(name, old, admin);
        }

        public static void SetRecord(string name, RecordType type, string data)
        {
            StorageContext context = Storage.CurrentContext;
            StorageMap nameMap = new(context, Prefix_Name);
            StorageMap recordMap = new(context, Prefix_Record);
            string[] fragments = SplitAndCheck(name, true);
            if (fragments is null) throw new FormatException("The format of the name is incorrect.");
            switch (type)
            {
                case RecordType.A:
                    if (!CheckIPv4(data)) throw new FormatException("The format of the A record is incorrect.");
                    break;
                case RecordType.CNAME:
                    if (SplitAndCheck(data, true) is null) throw new FormatException("The format of the CNAME record is incorrect.");
                    break;
                case RecordType.TXT:
                    if (data.Length > 255) throw new FormatException("The format of the TXT record is incorrect.");
                    break;
                case RecordType.AAAA:
                    if (!CheckIPv6(data)) throw new FormatException("The format of the AAAA record is incorrect.");
                    break;
                default:
                    throw new InvalidOperationException("The record type is not supported.");
            }
            string tokenId = name[^(fragments[^2].Length + fragments[^1].Length + 1)..];
            ByteString tokenKey = GetKey(tokenId);
            NameState token = (NameState)StdLib.Deserialize(nameMap[tokenKey]);
            token.EnsureNotExpired();
            token.CheckAdmin();
            byte[] recordKey = GetRecordKey(tokenKey, name, type);
            recordMap.PutObject(recordKey, new RecordState
            {
                Name = name,
                Type = type,
                Data = data
            });
        }

        [Safe]
        public static string GetRecord(string name, RecordType type)
        {
            StorageContext context = Storage.CurrentContext;
            StorageMap nameMap = new(context, Prefix_Name);
            StorageMap recordMap = new(context, Prefix_Record);
            string[] fragments = SplitAndCheck(name, true);
            if (fragments is null) throw new FormatException("The format of the name is incorrect.");
            string tokenId = name[^(fragments[^2].Length + fragments[^1].Length + 1)..];
            ByteString tokenKey = GetKey(tokenId);
            NameState token = (NameState)StdLib.Deserialize(nameMap[tokenKey]);
            token.EnsureNotExpired();
            byte[] recordKey = GetRecordKey(tokenKey, name, type);
            RecordState record = (RecordState)recordMap.GetObject(recordKey);
            if (record is null) return null;
            return record.Data;
        }

        [Safe]
        public static Iterator<RecordState> GetAllRecords(string name)
        {
            StorageContext context = Storage.CurrentContext;
            StorageMap nameMap = new(context, Prefix_Name);
            StorageMap recordMap = new(context, Prefix_Record);
            ByteString tokenKey = GetKey(name);
            NameState token = (NameState)StdLib.Deserialize(nameMap[tokenKey]);
            token.EnsureNotExpired();
            return (Iterator<RecordState>)recordMap.Find(tokenKey, FindOptions.ValuesOnly | FindOptions.DeserializeValues);
        }

        public static void DeleteRecord(string name, RecordType type)
        {
            StorageContext context = Storage.CurrentContext;
            StorageMap nameMap = new(context, Prefix_Name);
            StorageMap recordMap = new(context, Prefix_Record);
            string[] fragments = SplitAndCheck(name, true);
            if (fragments is null) throw new FormatException("The format of the name is incorrect.");
            string tokenId = name[^(fragments[^2].Length + fragments[^1].Length + 1)..];
            ByteString tokenKey = GetKey(tokenId);
            NameState token = (NameState)StdLib.Deserialize(nameMap[tokenKey]);
            token.EnsureNotExpired();
            token.CheckAdmin();
            byte[] recordKey = GetRecordKey(tokenKey, name, type);
            recordMap.Delete(recordKey);
        }

        [Safe]
        public static string Resolve(string name, RecordType type)
        {
            return Resolve(name, type, 2);
        }

        private static string Resolve(string name, RecordType type, int redirect)
        {
            if (redirect < 0) throw new InvalidOperationException("Too many redirections.");
            if (name.Length == 0) throw new InvalidOperationException("Invalid name.");
            if (name[name.Length - 1] == '.')
            {
                name = name.Substring(0, name.Length - 1);
            }
            string cname = null;
            foreach (var (key, state) in GetRecords(name))
            {
                RecordType rt = (RecordType)key[^1];
                if (rt == type) return state.Data;
                if (rt == RecordType.CNAME) cname = state.Data;
            }
            if (cname is null) return null;
            return Resolve(cname, type, redirect - 1);
        }

        private static Iterator<(ByteString, RecordState)> GetRecords(string name)
        {
            StorageContext context = Storage.CurrentContext;
            StorageMap nameMap = new(context, Prefix_Name);
            StorageMap recordMap = new(context, Prefix_Record);
            string[] fragments = SplitAndCheck(name, true);
            if (fragments is null) throw new FormatException("The format of the name is incorrect.");
            string tokenId = name[^(fragments[^2].Length + fragments[^1].Length + 1)..];
            ByteString tokenKey = GetKey(tokenId);
            NameState token = (NameState)StdLib.Deserialize(nameMap[tokenKey]);
            token.EnsureNotExpired();
            byte[] recordKey = Helper.Concat((byte[])tokenKey, GetKey(name));
            return (Iterator<(ByteString, RecordState)>)recordMap.Find(recordKey, FindOptions.DeserializeValues);
        }

        [DisplayName("_deploy")]
        public static void OnDeployment(object data, bool update)
        {
            if (update) return;
            string[] pre_registration = { "neo.neo", "ngd.neo" };
            StorageContext context = Storage.CurrentContext;
            Storage.Put(context, new byte[] { Prefix_TotalSupply }, pre_registration.Length);
            Storage.Put(context, new byte[] { Prefix_RegisterPrice }, StdLib.Serialize(new long[]
            {
                2_00000000,     // Prices for all other length domain names.
                -1,             // Domain names with a length of 1 are not open for registration by default.
                -1,             // Domain names with a length of 2 are not open for registration by default.
                200_00000000,   // Domain names with a length of 3 are not open for registration by default.
                70_00000000,    // Domain names with a length of 4 are not open for registration by default.
            }));

            StorageMap balanceMap = new(context, Prefix_Balance);
            StorageMap accountMap = new(context, Prefix_AccountToken);
            StorageMap rootMap = new(context, Prefix_Root);
            StorageMap nameMap = new(context, Prefix_Name);
            rootMap.Put("neo", 0);
            if (pre_registration.Length > 0)
            {
                balanceMap.Put(PreRegistrationOwner, pre_registration.Length);
                foreach (string name in pre_registration)
                {
                    ByteString tokenKey = GetKey(name);
                    NameState token = new()
                    {
                        Owner = PreRegistrationOwner,
                        Name = name,
                        Expiration = Runtime.Time + TenYears
                    };
                    nameMap[tokenKey] = StdLib.Serialize(token);
                    accountMap[PreRegistrationOwner + tokenKey] = name;
                    PostTransfer(null, PreRegistrationOwner, name, null);
                }
            }
        }

        private static void CheckCommittee()
        {
            ECPoint[] committees = NEO.GetCommittee();
            UInt160 committeeMultiSigAddr = Contract.CreateMultisigAccount(committees.Length - (committees.Length - 1) / 2, committees);
            if (!Runtime.CheckWitness(committeeMultiSigAddr))
                throw new InvalidOperationException("No authorization.");
        }

        private static ByteString GetKey(string tokenId)
        {
            return CryptoLib.Ripemd160(tokenId);
        }

        private static byte[] GetRecordKey(ByteString tokenKey, string name, RecordType type)
        {
            byte[] key = Helper.Concat((byte[])tokenKey, GetKey(name));
            return Helper.Concat(key, ((byte)type).ToByteArray());
        }

        private static void PostTransfer(UInt160 from, UInt160 to, ByteString tokenId, object data)
        {
            OnTransfer(from, to, 1, tokenId);
            if (to is not null && ContractManagement.GetContract(to) is not null)
                Contract.Call(to, "onNEP11Payment", CallFlags.All, from, 1, tokenId, data);
        }

        private static bool CheckFragment(string root, bool isRoot)
        {
            int maxLength = isRoot ? 16 : 63;
            if (root.Length == 0 || root.Length > maxLength) return false;
            char c = root[0];
            if (isRoot)
            {
                if (!isAlpha(c)) return false;
            }
            else
            {
                if (!isAlphaNum(c)) return false;
            }
            if (root.Length == 1) return true;
            for (int i = 1; i < root.Length - 1; i++)
            {
                c = root[i];
                if (!(isAlphaNum(c) || c == '-')) return false;
            }
            c = root[root.Length - 1];
            return isAlphaNum(c);
        }

        /// <summary>
        /// Denotes whether provided character is a lowercase letter.
        /// </summary>
        private static bool isAlpha(char c)
        {
            return c >= 'a' && c <= 'z';
        }

        /// <summary>
        /// Denotes whether provided character is a lowercase letter or a number.
        /// </summary>
        private static bool isAlphaNum(char c)
        {
            return isAlpha(c) || c >= '0' && c <= '9';
        }

        private static string[] SplitAndCheck(string name, bool allowMultipleFragments)
        {
            int length = name.Length;
            if (length < 3 || length > NameMaxLength) return null;
            string[] fragments = StdLib.StringSplit(name, ".");
            length = fragments.Length;
            if (length < 2 || length > 8) return null;
            if (length > 2 && !allowMultipleFragments) return null;
            for (int i = 0; i < length; i++)
                if (!CheckFragment(fragments[i], i == length - 1))
                    return null;
            return fragments;
        }

        private static bool CheckIPv4(string ipv4)
        {
            int length = ipv4.Length;
            if (length < 7 || length > 15) return false;
            string[] fragments = StdLib.StringSplit(ipv4, ".");
            length = fragments.Length;
            if (length != 4) return false;
            byte[] numbers = new byte[4];
            for (int i = 0; i < length; i++)
            {
                string fragment = fragments[i];
                if (fragment.Length == 0) return false;
                byte number = byte.Parse(fragment);
                if (number > 0 && fragment[0] == '0') return false;
                if (number == 0 && fragment.Length > 1) return false;
                numbers[i] = number;
            }
            switch (numbers[0])
            {
                case 0:
                case 10:
                case 100 when numbers[1] >= 64 && numbers[1] <= 127:
                case 127:
                case 169 when numbers[1] == 254:
                case 172 when numbers[1] >= 16 && numbers[1] <= 31:
                case 192 when numbers[1] == 0 && numbers[2] == 0:
                case 192 when numbers[1] == 0 && numbers[2] == 2:
                case 192 when numbers[1] == 88 && numbers[2] == 99:
                case 192 when numbers[1] == 168:
                case 198 when numbers[1] >= 18 && numbers[1] <= 19:
                case 198 when numbers[1] == 51 && numbers[2] == 100:
                case 203 when numbers[1] == 0 && numbers[2] == 113:
                case >= 224:
                    return false;
            }
            return numbers[3] switch
            {
                0 or 255 => false,
                _ => true,
            };
        }

        private static bool CheckIPv6(string ipv6)
        {
            int length = ipv6.Length;
            if (length < 2 || length > 39) return false;
            string[] fragments = StdLib.StringSplit(ipv6, ":");
            length = fragments.Length;
            if (length < 3 || length > 8) return false;
            ushort[] numbers = new ushort[8];
            bool isCompressed = false;
            for (int i = 0; i < length; i++)
            {
                string fragment = fragments[i];
                if (fragment.Length == 0)
                {
                    if (i == 0)
                    {
                        if (fragments[1].Length != 0) return false;
                        numbers[0] = 0;
                    }
                    else if (i == length - 1)
                    {
                        if (fragments[i - 1].Length != 0) return false;
                        numbers[7] = 0;
                    }
                    else
                    {
                        if (isCompressed) return false;
                        isCompressed = true;
                        int endIndex = 9 - length + i;
                        for (int j = i; j < endIndex; j++)
                            numbers[j] = 0;
                    }
                }
                else
                {
                    if (fragment.Length > 4) return false;
                    int index = isCompressed ? i + 8 - length : i;
                    numbers[index] = (ushort)(short)StdLib.Atoi(fragment, 16);
                }
            }
            if (length < 8 && !isCompressed) return false;
            ushort number = numbers[0];
            if (number < 0x2000 || number == 0x2002 || number == 0x3ffe || number > 0x3fff)
                return false;
            if (number == 0x2001)
            {
                number = numbers[1];
                if (number < 0x200 || number == 0xdb8) return false;
            }
            return true;
        }
    }
}
