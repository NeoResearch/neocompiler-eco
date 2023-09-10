// SPDX-License-Identifier: MIT
using Neo;
using Neo.SmartContract;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Attributes;
using Neo.SmartContract.Framework.Native;
using Neo.SmartContract.Framework.Services;
using System;
using System.Numerics;

namespace OracleDemo
{
    [ManifestExtra("Author", "Neo")]
    [ManifestExtra("Email", "dev@neo.org")]
    [ManifestExtra("Description", "This is an oracle example")]
    public class OracleDemo : SmartContract
    {
        public static void DoRequest()
        {
            string url = "https://compilers-neo3.neocompiler.io/";
            string filter = "$.result";  // JSONPath format https://github.com/atifaziz/JSONPath
            string callback = "callback"; // callback method
            object userdata = "userdata"; // arbitrary type
            long gasForResponse = Oracle.MinimumResponseFee;

            Oracle.Request(url, filter, callback, userdata, gasForResponse);
        }

        public static void DoRequestWithParameters(string filter, string url, long gasForResponse)
        {
            string callback = "callback"; // callback method
            object userdata = "userdata"; // arbitrary type
            Oracle.Request(url, filter, callback, userdata, gasForResponse);
        }
        
        public static void Callback(string url, string userdata, OracleResponseCode code, string result)
        {
            if (Runtime.CallingScriptHash != Oracle.Hash) throw new Exception("Unauthorized!");
            if (code != OracleResponseCode.Success) throw new Exception("Oracle response failure with code " + (byte)code);

            object ret = StdLib.JsonDeserialize(result); // [ "hello world" ]
            object[] arr = (object[])ret;
            string value = (string)arr[0];

            Runtime.Log("userdata: " + userdata);
            Runtime.Log("response value: " + value);
        }
    }
}
