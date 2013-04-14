using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Google.GData.Client;
using Google.GData.YouTube;
using Google.YouTube;
using MobileYoutubeView.Dal;
using MobileYoutubeView.Models;
using StructureMap;

namespace MobileYoutubeView.Api
{
    public class YouTubeController : ApiController
    {
        private readonly YouTubeRepository _youTubeRepository;

        public YouTubeController()
            : this(ObjectFactory.GetInstance<YouTubeRepository>())
        {
            //USe simple ObjectFactory as a Service Locator to start with! 
        }

        public YouTubeController(YouTubeRepository youTubeRepository)
        {
            _youTubeRepository = youTubeRepository;
        }

        public IEnumerable<VideoEntry> Get(string query)
        {
            return _youTubeRepository.Search(query);
        }
    }
}