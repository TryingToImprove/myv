using System;
using System.Collections.Generic;
using System.Linq;
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
    }
}