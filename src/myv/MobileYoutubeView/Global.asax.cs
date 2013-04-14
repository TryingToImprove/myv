using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using Microsoft.AspNet.SignalR;
using MobileYoutubeView.Dal;
using StructureMap;

namespace MobileYoutubeView
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            RouteTable.Routes.MapHubs();
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            ObjectFactory.Container.Configure(factory =>
                {
                    // ReSharper disable ConvertToLambdaExpression
                    factory.For<YouTubeRepository>()
                           .HybridHttpOrThreadLocalScoped()
                           .Use(
                               x =>
                               new YouTubeRepository(ConfigurationManager.AppSettings["YouTube:AppName"],
                                                     ConfigurationManager.AppSettings["YouTube:DeveloperKey"]));
                    // ReSharper restore ConvertToLambdaExpression
                });
        }
    }
}