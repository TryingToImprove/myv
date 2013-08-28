using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;
using MobileYoutubeView.Dal;
using MobileYoutubeView.Factories;
using MobileYoutubeView.Models;
using StructureMap;

namespace MobileYoutubeView.Hubs
{
    public class MainHub : Hub
    {
        public static List<Screen> ConnectedScreens = new List<Screen>();
        public static List<RemoteController> ConnectedRemoteControllers = new List<RemoteController>();

        private readonly YouTubeRepository _youTubeRepository;
        private readonly ScreenFactory _screenFactory;

        public MainHub()
            : this(ObjectFactory.GetInstance<YouTubeRepository>())
        {
            //USe simple ObjectFactory as a Service Locator to start with! 
        }

        public MainHub(YouTubeRepository youTubeRepository)
        {
            _youTubeRepository = youTubeRepository;
            _screenFactory = new ScreenFactory(); ;
        }

        public void ConnectScreen(string name)
        {
            //Create the screen
            Screen screen = _screenFactory.CreateNew(Context.ConnectionId, name);

            //Add the screen to unique group
            Groups.Add(Context.ConnectionId, screen.GroupName);

            //Add the screen to the connected screns
            ConnectedScreens.Add(screen);

            //Call the viewer event
            Clients.Caller.Publish("views:show:viewer", screen);

            //Cal the remotecontrollers
            Clients.All.Publish("screen:joined", screen);
        }

        public void JoinScreen(string screenId)
        {
            //Find the screen the caller want to join
            var screen = ConnectedScreens.Find(x => x.Id.ToString().Equals(screenId));

            //Add the screen to unique group
            Groups.Add(Context.ConnectionId, screen.GroupName);

            //Call the viewer event
            Clients.Caller.Publish("views:show:viewer", screen);
        }

        public void GetOnlineScreens()
        {
            //Send the connected screens to the caller
            Clients.Caller.Publish("data:screens:all:loaded", ConnectedScreens);
        }

        public void RequestScreens()
        {
            //Send the connected screens to the caller
            Clients.Caller.Publish("data:screens:all:loaded", ConnectedScreens);
        }

        public void ConnectRemoteController(string screenId)
        {
            //Find the screen
            var screen = ConnectedScreens.Find(x => x.Id.ToString().Equals(screenId));

            //Create a remote control.
            var remoteController = new RemoteController
                {
                    Id = Guid.NewGuid(),
                    Screen = screen,
                    ConnectedAt = DateTime.Now
                };

            //Add the remote controller to a signalR group
            Groups.Add(Context.ConnectionId, remoteController.ScreenGroupName);

            //Publish
            Clients.Caller.Publish("views:show:remoteController", remoteController, screen);
        }

        public void SendVideoRequest(string videoId, RemoteController remoteController)
        {
            //Load the video from YouTube with the needed information
            var video = _youTubeRepository.GetById(videoId);

            //Notify the screen group
            Clients.Group(remoteController.Screen.GroupName).Publish("video:request", video);
            Clients.Group(remoteController.ScreenGroupName).Publish("video:request", video);
        }

        public void SendPauseRequest(RemoteController remoteController)
        {
            //Notify the screen group
            Clients.Group(remoteController.Screen.GroupName).Publish("video:pause");
        }

        public void SendPlayRequest(RemoteController remoteController)
        {
            //Notify the screen group
            Clients.Group(remoteController.Screen.GroupName).Publish("video:play");
        }

        public void SendVolumeUp(RemoteController remoteController)
        {
            //Notify the screen group
            Clients.Group(remoteController.Screen.GroupName).Publish("volume:up");
        }

        public void SendVolumeDown(RemoteController remoteController)
        {
            //Notify the screen group
            Clients.Group(remoteController.Screen.GroupName).Publish("volume:down");
        }

        public override Task OnDisconnected()
        {
            //Get all screens where the disconnected caller is associated with
            var screensWhereConntectionIsAssociated = ConnectedScreens.Where(x => x.Connected.Contains(Context.ConnectionId));

            foreach (var screen in screensWhereConntectionIsAssociated)
            {
                //Remove the disconnected caller from the list of connected callers
                screen.Connected.RemoveAll(x => x.Equals(Context.ConnectionId));

                //If there is no connected callers to the screen then remove it from the list of connected screens
                if (screen.Connected.Count == 0)
                {
                    //Remove
                    ConnectedScreens.Remove(screen);

                    //Notify the clients that the screen have been removed
                    Clients.All.Publish("data:screens:removed", screen);
                    Clients.Group(screen.RemoteControllersGroupName).Publish("current:screen:removed", screen);
                }

                //Notify the remote controllers that the screen have been disconnected (usefull for displaing number of active screens)
                Clients.Group(screen.RemoteControllersGroupName).Publish("current:screen:disconnected", screen);
            }

            return null;
        }
    }
}