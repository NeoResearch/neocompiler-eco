using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Services.Neo;

namespace Neo.SmartContract
{
    public class MyCheckWitness : Framework.SmartContract
    {
        public static readonly byte[] Owner = "AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y".ToScriptHash();
        //public static readonly byte[] Owner = "031a6c6fbbdf02ca351745fa86b9ba5a9452d785ac4f7fc2b7548ca2a46c4fcf4a".HexToBytes();
        //public static readonly byte[] Owner = {3,26,108,111,187,223,2,202,53,23,69,250,134,185,186,90,148,82,215,133,172,79,127,194,183,84,140,162,164,108,79,207,74};

        public static bool Main()
        {
            bool result = Runtime.CheckWitness(Owner);
            if (result)
            {
                Runtime.Notify("OWNER is caller");
                return true;
            }
            return false;
        }
    }
}
