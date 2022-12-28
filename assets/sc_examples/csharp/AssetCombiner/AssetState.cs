using Neo.SmartContract.Framework;
using System.Numerics;

namespace Neo.SmartContract
{
    class AssetState
    {
        public UInt160 Hash;
        public BigInteger Amount;
        public ByteString TokenId;
    }
}
