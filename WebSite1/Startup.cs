using Fanex.Logging;
using Fanex.Logging.Sentry;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Sentry;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace WebSite1
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });

            var appSettings = Configuration.GetSection("AppSettings").Get<AppSettings>();
            Console.WriteLine("----------------APPSETTINGS----------------");
            Console.WriteLine($"SentryDsn: {appSettings.SentryDsn}");
            Console.WriteLine($"SentryEnvironment: {appSettings.SentryEnvironment}");
            Console.WriteLine("----------------SHARED APPSETTINGS----------------");
            Console.WriteLine($"Environment: {Configuration.GetSection("Environment").Value}");
            Console.WriteLine($"ApplicationName: {Configuration.GetSection("ApplicationName").Value}");
            Console.WriteLine($"Version: {Configuration.GetSection("Version").Value}");
            Console.WriteLine("--------------------------------");

            Console.WriteLine("----------------WRITING DATA FILE----------------");
            var dataFilePath = Path.Combine(Directory.GetCurrentDirectory(), "data", "data.txt");
            File.AppendAllText(dataFilePath, $"Hello, world! at {DateTimeOffset.Now}" + Environment.NewLine);
            Console.WriteLine($"Data written to: {dataFilePath}");
            Console.WriteLine("--------------------------------");
            Console.WriteLine("----------------READING DATA FILE----------------");
            var data = File.ReadAllText(dataFilePath);
            Console.WriteLine($"Data read from: {dataFilePath}");
            Console.WriteLine($"Data: {data}");
            Console.WriteLine("--------------------------------");

            LogManager
                 .SetDefaultLogCategory(appSettings.SentryEnvironment)
                 .Use(new List<ILogEngine>
                 {
                     new SentryLogging(new SentryEngineOptions {
                        Dsn = new Dsn(appSettings.SentryDsn),
                        Environment = appSettings.SentryEnvironment
                     })
                 });
        }
    }
}
