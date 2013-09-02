using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MobileYoutubeView.Models
{
    public class RemoteController
    {
        public Guid Id { get; set; }
        public Screen Screen { get; set; }
        public DateTime ConnectedAt { get; set; }
    }
}