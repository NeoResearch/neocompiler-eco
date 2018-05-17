using Neo.Shell;
using Neo.Wallets;
using System;
using System.IO;

namespace Neo
{
    class Report
    {
	public DateTime? d;
	public string header;

	public Report(string _header)
	{
	   this.d = DateTime.Now;
	   this.header = _header;
           Console.WriteLine("Starting test at " + header);
	}

	public void appendElapsedTime(string output)
	{
	    DateTime? d2 = DateTime.Now;
            string reportMessage= "Elapsed in seconds are "+ header + (double)(d2 - d).GetValueOrDefault().TotalSeconds + "\n";
	    Console.WriteLine(reportMessage);
            //File.WriteAllText("./Report.txt", reportMessage);
	    File.AppendAllText(output, reportMessage);
	}          
    }


    static class Program
    {
        internal static Wallet Wallet;

        private static void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            using (FileStream fs = new FileStream("error.log", FileMode.Create, FileAccess.Write, FileShare.None))
            using (StreamWriter w = new StreamWriter(fs))
            {
                PrintErrorLogs(w, (Exception)e.ExceptionObject);
            }
        }

        static void Main(string[] args)
        {

            AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;
            new MainService().Run(args);
        }

        private static void PrintErrorLogs(StreamWriter writer, Exception ex)
        {
            writer.WriteLine(ex.GetType());
            writer.WriteLine(ex.Message);
            writer.WriteLine(ex.StackTrace);
            if (ex is AggregateException ex2)
            {
                foreach (Exception inner in ex2.InnerExceptions)
                {
                    writer.WriteLine();
                    PrintErrorLogs(writer, inner);
                }
            }
            else if (ex.InnerException != null)
            {
                writer.WriteLine();
                PrintErrorLogs(writer, ex.InnerException);
            }
        }
    }
}
