using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Google.GData.Client;
using Google.GData.YouTube;
using Google.YouTube;

namespace MobileYoutubeView.Api
{
    public class VideoEntry
    {
        public string Title { get; set; }
        public string Id { get; set; }
    }

    public class YouTubeController : ApiController
    {
        private const string DeveloperKey =
            "AI39si571s4xf0sI3fqTG4r82UXn6KCxdKPzCZYp6wze-kFcrZrZfYNDVvorIEpCnQwTDomkwnMgIgznWLDAb7lH19gvSl7Unw";

        public IEnumerable<VideoEntry> Get(string query)
        {
            var settings = new YouTubeRequestSettings("Songbird", DeveloperKey);
            var request = new YouTubeRequest(settings);

            Feed<Video> videoFeed = request.Get<Video>(new YouTubeQuery(YouTubeQuery.DefaultVideoUri)
                {
                    Query = query
                });

            return videoFeed.Entries.Select(video => new VideoEntry
                {
                    Title = video.Title,
                    Id = video.VideoId
                });
        }
    }
}