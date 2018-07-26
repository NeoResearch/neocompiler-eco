using Neo.SmartContract.Framework.Services.Neo;

namespace Neo.SmartContract
{
    public class HelloWorldNotification : Framework.SmartContract
    {
        public static void Main()
        {
            Runtime.Notify("Hello World");
        }
    }
}
