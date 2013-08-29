using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web.Http;
using System.Xml;
using System.Xml.Serialization;
using Google.GData.Client;
using Google.GData.YouTube;
using Google.YouTube;
using MobileYoutubeView.Dal;
using MobileYoutubeView.Models;
using StructureMap;

namespace MobileYoutubeView.Api
{
    public class YouTubeVideoController : ApiController
    {
        private readonly YouTubeRepository _youTubeRepository;

        public YouTubeVideoController()
            : this(ObjectFactory.GetInstance<YouTubeRepository>())
        {
            //USe simple ObjectFactory as a Service Locator to start with! 
        }

        public YouTubeVideoController(YouTubeRepository youTubeRepository)
        {
            _youTubeRepository = youTubeRepository;
        }

        public IEnumerable<VideoEntry> Get(string query)
        {
            return _youTubeRepository.Search(query);
        }
    }
}