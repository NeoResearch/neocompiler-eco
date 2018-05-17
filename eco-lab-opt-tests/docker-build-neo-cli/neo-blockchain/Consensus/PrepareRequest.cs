using Neo.Core;
using Neo.IO;
using System;
using System.IO;
using System.Linq;

namespace Neo.Consensus
{
    internal class PrepareRequest : ConsensusMessage
    {
        public ulong Nonce;
        public UInt160 NextConsensus;
        public UInt256[] TransactionHashes;
        public MinerTransaction MinerTransaction;
        public byte[] Signature;

        public PrepareRequest()
            : base(ConsensusMessageType.PrepareRequest)
        {
        }

        public override void Deserialize(BinaryReader reader)
        {
	    ReportNeoBlockchain reportObj = new ReportNeoBlockchain("[NeoPrepareRequest-Deserialize]");

            base.Deserialize(reader);
            Nonce = reader.ReadUInt64();
            NextConsensus = reader.ReadSerializable<UInt160>();
            TransactionHashes = reader.ReadSerializableArray<UInt256>();
            if (TransactionHashes.Distinct().Count() != TransactionHashes.Length)
                throw new FormatException();
            MinerTransaction = reader.ReadSerializable<MinerTransaction>();
            if (MinerTransaction.Hash != TransactionHashes[0])
                throw new FormatException();
            Signature = reader.ReadBytes(64);

	    reportObj.appendElapsedTime();
        }

        public override void Serialize(BinaryWriter writer)
        {
	    ReportNeoBlockchain reportObj = new ReportNeoBlockchain("[NeoPrepareRequest-Serialize]");

            base.Serialize(writer);
            writer.Write(Nonce);
            writer.Write(NextConsensus);
            writer.Write(TransactionHashes);
            writer.Write(MinerTransaction);
            writer.Write(Signature);

	    reportObj.appendElapsedTime();
        }
    }
}
