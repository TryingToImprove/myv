using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MobileYoutubeView.Models
{
    public class Screen
    {
        public Screen()
        {
            RemoteControllers = new List<RemoteController>();
            Connected = new List<string>();
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime Started { get; set; }
        public List<RemoteController> RemoteControllers { get; set; }
        public List<string> Connected { get; set; }

        public string GroupName { get { return "Screen-" + Id.ToString(); } }

        public void AddRemoteController(RemoteController remoteController)
        {
            RemoteControllers.Add(remoteController);
        }
    }
}