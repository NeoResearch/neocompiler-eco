#pragma warning disable IDE0060

using Neo.Cryptography.ECC;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Attributes;
using Neo.SmartContract.Framework.Native;
using Neo.SmartContract.Framework.Services;
using System;
using System.Numerics;

namespace Neo.SmartContract
{
    [ManifestExtra("Author", "The Neo Project")]
    [ManifestExtra("Email", "dev@neo.org")]
    [ManifestExtra("Description", "Asset Combiner")]
    [SupportedStandards("NEP-11")]
    [ContractPermission("*", "transfer", "onNEP11Payment")]
    [ContractSourceCode("https://github.com/neo-project/non-native-contracts")]
    public sealed class AssetCombiner : Nep11Token<ContainerState>
    {
        private const byte Prefix_AssetId = 0x10;
        private const byte Prefix_Asset = 0x11;

        [Safe]
        public override string Symbol() => "NAC";

        [Safe]
        public override Map<string, object> Properties(ByteString tokenId)
        {
            StorageMap containerMap = new(Storage.CurrentContext, Prefix_Token);
            ContainerState token = (ContainerState)StdLib.Deserialize(containerMap[tokenId]);
            Map<string, object> map = base.Properties(tokenId);
            map["category"] = token.Category;
            map["maker"] = token.Maker;
            return map;
        }

        public static void Update(ByteString nef, string manifest)
        {
            if (!CheckCommittee()) throw new Exception("No authorization.");
            ContractManagement.Update(nef, manifest);
        }

        public static ByteString Mint(string name, string category)
        {
            if (name is null || name.Length == 0) throw new Exception("The name is required.");
            if (name.Length > 256) throw new Exception("The name is too long.");
            if (category is null) throw new Exception("The category cannot be null.");
            if (category.Length > 256) throw new Exception("The category is too long.");
            Transaction tx = (Transaction)Runtime.ScriptContainer;
            ByteString tokenId = NewTokenId();
            Mint(tokenId, new ContainerState
            {
                Owner = tx.Sender,
                Name = name,
                Category = category,
                Maker = tx.Sender
            });
            return tokenId;
        }

        public static void Unbox(ByteString tokenId)
        {
            StorageContext context = Storage.CurrentContext;
            StorageMap containerMap = new(context, Prefix_Token);
            StorageMap assetMap = new(context, Prefix_Asset);
            ContainerState container = (ContainerState)StdLib.Deserialize(containerMap[tokenId]);
            if (container.Owner == Runtime.ExecutingScriptHash) ExecutionEngine.Abort();
            if (!Runtime.CheckWitness(container.Owner)) ExecutionEngine.Abort();
            Burn(tokenId);
            var iterator = (Iterator<(ByteString, AssetState)>)assetMap.Find(tokenId, FindOptions.DeserializeValues);
            foreach (var (key, asset) in iterator)
            {
                assetMap.Delete(key);
                if (asset.TokenId is null)
                    Contract.Call(asset.Hash, "transfer", CallFlags.All, Runtime.ExecutingScriptHash, container.Owner, asset.Amount, null);
                else if (asset.Amount == 1)
                    Contract.Call(asset.Hash, "transfer", CallFlags.All, container.Owner, asset.TokenId, null);
                else
                    Contract.Call(asset.Hash, "transfer", CallFlags.All, Runtime.ExecutingScriptHash, container.Owner, asset.Amount, asset.TokenId, null);
            }
        }

        [Safe]
        public static Iterator AssetsOf(ByteString tokenId)
        {
            StorageContext context = Storage.CurrentContext;
            StorageMap containerMap = new(context, Prefix_Token);
            StorageMap assetMap = new(context, Prefix_Asset);
            if (containerMap[tokenId] is null)
                throw new Exception("The tokenId doesn't exist.");
            return assetMap.Find(tokenId, FindOptions.ValuesOnly | FindOptions.DeserializeValues);
        }

        public static void OnNEP11Payment(UInt160 from, BigInteger amount, ByteString tokenId, ByteString containerId)
        {
            if (containerId is null) ExecutionEngine.Abort();
            if (tokenId == containerId) ExecutionEngine.Abort();
            UInt160 hash = Runtime.CallingScriptHash;
            if (ContractManagement.GetContract(hash) is null) ExecutionEngine.Abort();
            StorageContext context = Storage.CurrentContext;
            StorageMap containerMap = new(context, Prefix_Token);
            StorageMap assetMap = new(context, Prefix_Asset);
            ContainerState container = (ContainerState)StdLib.Deserialize(containerMap[containerId]);
            if (!Runtime.CheckWitness(container.Owner)) ExecutionEngine.Abort();
            ByteString assetId = NewAssetId();
            AssetState asset = new()
            {
                Hash = hash,
                Amount = amount,
                TokenId = tokenId
            };
            assetMap[containerId + assetId] = StdLib.Serialize(asset);
        }

        public static void OnNEP17Payment(UInt160 from, BigInteger amount, ByteString containerId)
        {
            if (containerId is null) ExecutionEngine.Abort();
            UInt160 hash = Runtime.CallingScriptHash;
            if (ContractManagement.GetContract(hash) is null) ExecutionEngine.Abort();
            StorageContext context = Storage.CurrentContext;
            StorageMap containerMap = new(context, Prefix_Token);
            StorageMap assetMap = new(context, Prefix_Asset);
            ContainerState container = (ContainerState)StdLib.Deserialize(containerMap[containerId]);
            if (!Runtime.CheckWitness(container.Owner)) ExecutionEngine.Abort();
            ByteString assetId = NewAssetId();
            AssetState asset = new()
            {
                Hash = hash,
                Amount = amount,
                TokenId = null
            };
            assetMap[containerId + assetId] = StdLib.Serialize(asset);
        }

        private static bool CheckCommittee()
        {
            ECPoint[] committees = NEO.GetCommittee();
            UInt160 committeeMultiSigAddr = Contract.CreateMultisigAccount(committees.Length - (committees.Length - 1) / 2, committees);
            return Runtime.CheckWitness(committeeMultiSigAddr);
        }

        private static ByteString NewAssetId()
        {
            StorageContext context = Storage.CurrentContext;
            byte[] key = new byte[] { Prefix_AssetId };
            BigInteger id = (BigInteger)Storage.Get(context, key);
            id++;
            Storage.Put(context, key, id);
            return (ByteString)id;
        }
    }
}
