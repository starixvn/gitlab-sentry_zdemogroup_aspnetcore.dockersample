using AspNetCoreSample.Controllers;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace AspNetCoreSample.Tests.Controllers
{
    public class HomeControllerTests
    {
        private readonly HomeController controller;

        public HomeControllerTests()
        {
            controller = new HomeController();
        }

        [Fact]
        public void Index_Any_ReturnViewResult()
        {
            // Act
            var result = controller.Index();

            // Assert
            Assert.IsType<ViewResult>(result);
        }

        [Fact]
        public void About_Any_ReturnViewResult()
        {
            // Act
            var result = controller.About();

            // Assert
            Assert.IsType<ViewResult>(result);
        }

        [Fact]
        public void Contact_Any_ReturnViewResult()
        {
            // Act
            var result = controller.Contact();

            // Assert
            Assert.IsType<ViewResult>(result);
        }

        [Fact]
        public void Error_Any_ReturnViewResult()
        {
            // Act
            var result = controller.Error();

            // Assert
            Assert.IsType<ViewResult>(result);
        }
    }
}
