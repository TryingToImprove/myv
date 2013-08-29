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
    public class YouTubeSuggestionController : ApiController
    {
        private readonly YouTubeRepository _youTubeRepository;

        public YouTubeSuggestionController()
            : this(ObjectFactory.GetInstance<YouTubeRepository>())
        {
            //USe simple ObjectFactory as a Service Locator to start with! 
        }

        public YouTubeSuggestionController(YouTubeRepository youTubeRepository)
        {
            _youTubeRepository = youTubeRepository;
        }
        
        public IEnumerable<string> Get(string query)
        {
            const string baseUrl = "http://clients1.google.com/complete/search?hl=en&output=toolbar&q={0}";
            string url = String.Format(baseUrl, HttpUtility.UrlEncode(query));

            var request = WebRequest.Create(url);

            using (var response = request.GetResponse())
            {
                using (var stream = response.GetResponseStream())
                {
                    if (stream == null) return null;

                    using (var streamReader = new StreamReader(stream, Encoding.GetEncoding("ISO-8859-1")))
                    // We need to use ISO-encoding otherwise it will not work
                    using (var reader = XmlReader.Create(streamReader, new XmlReaderSettings
                    {
                        CheckCharacters = false
                    }))
                    {
                        var serializer = new XmlSerializer(typeof(YouTubeSuggestionList));

                        var obj = (YouTubeSuggestionList)serializer.Deserialize(reader);

                        var result = obj.CompleteSuggestion.Select(x => x.Suggestion.Data);
                        return result;
                    }
                }
            }
        }
    }
}