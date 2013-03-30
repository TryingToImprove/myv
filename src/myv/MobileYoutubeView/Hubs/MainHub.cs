using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace MobileYoutubeView.Hubs
{
    public class MainHub : Hub
    {
        public void Hello()
        {
            Clients.All.hello();
        }
    }
}