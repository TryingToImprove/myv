using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Xml;
using System.Xml.Serialization;
using Google.GData.Client;
using Google.GData.YouTube;
using Google.YouTube;
using MobileYoutubeView.Factories;
using MobileYoutubeView.Models;

namespace MobileYoutubeView.Dal
{
    public class YouTubeRepository
    {
        private readonly string _appName;
        private readonly string _developerKey;
        private readonly YouTubeRequestSettings _settings;

        private readonly VideoEntryFactory _videoEntryFactory;

        public YouTubeRepository(string appName, string developerKey)
        {
            _appName = appName;
            _developerKey = developerKey;

            _settings = new YouTubeRequestSettings(_appName, _developerKey);

            _videoEntryFactory = new VideoEntryFactory();
        }

        public VideoEntry GetById(string videoId)
        {
            var request = new YouTubeRequest(_settings);

            var video =
                request.Retrieve<Video>(new Uri(String.Format("http://gdata.youtube.com/feeds/api/videos/{0}", videoId)));

            return _videoEntryFactory.Build(video);
        }

        public IEnumerable<VideoEntry> Search(string term)
        {
            var request = new YouTubeRequest(_settings);

            Feed<Video> videoFeed = request.Get<Video>(new YouTubeQuery(YouTubeQuery.DefaultVideoUri)
                {
                    Query = term
                });

            return videoFeed.Entries.Select(video => _videoEntryFactory.Build(video));
        }

        public IEnumerable<string> GetSuggestions(string term)
        {
            const string baseUrl = "http://clients1.google.com/complete/search?hl=en&output=toolbar&q={0}";
            string url = String.Format(baseUrl, HttpUtility.UrlEncode(term));

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
                        var results = (YouTubeSuggestionList)serializer.Deserialize(reader);

                        return results.CompleteSuggestion.Select(x => x.Suggestion.Data);
                    }
                }
            }
        } 
    }
}