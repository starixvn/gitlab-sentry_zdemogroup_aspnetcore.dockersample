using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sentry;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using WebSite1.Models;

namespace WebSite1.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public void LogInfo()
        {
            SentrySdk.CaptureMessage("This is a information log");
        }

        public void LogError()
        {
            SentrySdk.CaptureMessage("This is a ERROR log", SentryLevel.Error);
        }

        public void LogWarning()
        {
            SentrySdk.CaptureMessage("This is a Warning log", SentryLevel.Warning);
        }
    }
}
