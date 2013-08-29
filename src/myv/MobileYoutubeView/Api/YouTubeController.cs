using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Xml.Serialization;
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

        public IEnumerable<string> GetSuggestions(string query)
        {
            const string url = "http://clients1.google.com/complete/search?hl=en&output=toolbar&q={0}";
            var request = WebRequest.Create(String.Format(url, query));

            using (var response = request.GetResponse())
            {
                using (var stream = response.GetResponseStream())
                {
                    if (stream == null) return null;

                    var serializer = new XmlSerializer(typeof(toplevel));

                    var obj = (toplevel)serializer.Deserialize(stream);

                    var result = obj.CompleteSuggestion.Select(x => x.suggestion.data);

                    return result;
                }
            }
        }
    }
}