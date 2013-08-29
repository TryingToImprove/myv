﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace MobileYoutubeView
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}"
            );
            config.Routes.MapHttpRoute(
                name: "DefaultActionApi",
                routeTemplate: "api/{controller}/{action}"
            );
        }
    }
}
