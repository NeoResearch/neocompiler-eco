Quick start
=============

Hello World on C#
-----------------

.. code-block:: c#

    // importing NeoContract for C#
    using Neo.SmartContract.Framework.Services.Neo;
    // Developing a basic "Hello World" smart contract, or "Hello Visitor1234"
    namespace Neo.SmartContract
    {
        public class HelloWorld : Framework.SmartContract
        {
            public static void Main()
            {
                Storage.Put("Hello", "Visitor1234");
            }
        }
    }

Since we are dealing with an online platform with a `Shared PrivateNet <./concepts.html#shared-privatenet>`_,
it is better to personalize your own contract, by changing *Visitor1234* with your preferred name. 

To compile it and see the results, click on *Compile*.
