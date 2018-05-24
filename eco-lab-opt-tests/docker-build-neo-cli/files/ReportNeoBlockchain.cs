using Microsoft.Extensions.Configuration;
using Neo.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;

namespace Neo
{
    class ReportNeoBlockchain
    {
	public DateTime? d;
	public string header;

	public ReportNeoBlockchain(string _header)
	{
	   this.d = DateTime.Now;
	   this.header = _header;
           Console.WriteLine("Starting test at " + header);
	}

	public void appendElapsedTime()
	{
            string output = "./Report-" + header + ".txt";
	    DateTime? d2 = DateTime.Now;
            string reportMessage= "Elapsed in seconds are " + header + ": " + (double)(d2 - d).GetValueOrDefault().TotalSeconds + "\n";
	    Console.WriteLine(reportMessage);
	    File.AppendAllText(output, reportMessage);
            //File.WriteAllText("./Report.txt", reportMessage);
	}          
    }
}
