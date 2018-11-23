using Neo.SmartContract.Framework.Services.Neo;

namespace Neo.SmartContract
{
    public class HelloWorld : Framework.SmartContract
    {
        public static void Main()
        {
            // writes value "World" on storage key "Hello"
            // implicitly calls Storage.Put(Storage.CurrentContext, "Hello", "World")
            Storage.Put("Hello", "World");
        }
    }
}
