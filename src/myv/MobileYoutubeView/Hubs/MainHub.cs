using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;
using MobileYoutubeView.Dal;
using StructureMap;

namespace MobileYoutubeView.Hubs
{
    public class MainHub : Hub
    {
        private readonly YouTubeRepository _youTubeRepository;

        public MainHub()
            : this(ObjectFactory.GetInstance<YouTubeRepository>())
        {
            //USe simple ObjectFactory as a Service Locator to start with! 
        }

        public MainHub(YouTubeRepository youTubeRepository)
        {
            _youTubeRepository = youTubeRepository;
        }

        public void SendVideoRequest(string videoId)
        {
            var video = _youTubeRepository.GetById(videoId);

            Clients.All.Publish("video:request", video);
        }

        public void SendPauseRequest()
        {
            Clients.All.Publish("video:pause");
        }

        public void SendPlayRequest()
        {
            Clients.All.Publish("video:play");
        }

        public void VolumeUp()
        {
            Clients.All.Publish("volume:up");
        }

        public void VolumeDown()
        {
            Clients.All.Publish("volume:down");
        } 
    }
}