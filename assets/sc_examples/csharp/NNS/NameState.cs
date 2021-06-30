using Neo.SmartContract.Framework.Services;
using System;

namespace Neo.SmartContract
{
    class NameState
    {
        public UInt160 Owner;
        public string Name;
        public ulong Expiration;
        public UInt160 Admin;

        public void EnsureNotExpired()
        {
            if (Runtime.Time >= Expiration)
                throw new Exception("The name has expired.");
        }

        public void CheckAdmin()
        {
            if (Runtime.CheckWitness(Owner)) return;
            if (Admin is null || !Runtime.CheckWitness(Admin))
                throw new InvalidOperationException("No authorization.");
        }
    }
}
