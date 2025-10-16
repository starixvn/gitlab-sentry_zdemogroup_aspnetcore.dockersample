using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace WebSite1
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((context, config) =>
                {
                    // Clear default configuration sources
                    config.Sources.Clear();

                    // Get the content root path
                    var contentRoot = context.HostingEnvironment.ContentRootPath;

                    // Find all appsettings.*.json files including appsettings.json
                    var appsettingsFiles = Directory.GetFiles(contentRoot, "appsettings*.json")
                        .OrderBy(f => f)
                        .ToList();

                    // Add all appsettings files in alphabetical order
                    foreach (var file in appsettingsFiles)
                    {
                        var fileName = Path.GetFileName(file);
                        var isRequired = fileName == "appsettings.json";
                        config.AddJsonFile(fileName, optional: !isRequired, reloadOnChange: true);
                    }

                    // Add command line arguments
                    config.AddCommandLine(args);

                    // Add environment variables
                    config.AddEnvironmentVariables();
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseUrls("http://0.0.0.0:5000");
                    webBuilder.UseStartup<Startup>();
                });
    }
}
