using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NSubstitute;
using System;
using WebSite1.Controllers;
using Xunit;

namespace Website1.Tests
{
    public class HomeControllerTests
    {
        private readonly HomeController controller;
        private readonly ILogger<HomeController> mockLogger;

        public HomeControllerTests()
        {
            mockLogger = Substitute.For<ILogger<HomeController>>();
            controller = new HomeController(mockLogger);
        }

        [Fact]
        public void Index_NoParams_ReturnViewResult()
        {
            var view = controller.Index();

            Assert.IsType<ViewResult>(view);
        }

        [Fact]
        public void Privacy_NoParams_ReturnViewResult()
        {
            var view = controller.Privacy();

            Assert.IsType<ViewResult>(view);
        }

        [Fact]
        public void Fail_Test()
        {
            Assert.Equal(0, 1);
        }
    }
}
