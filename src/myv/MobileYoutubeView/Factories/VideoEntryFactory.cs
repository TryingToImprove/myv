using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Google.YouTube;
using MobileYoutubeView.Models;

namespace MobileYoutubeView.Factories
{
    public class VideoEntryFactory
    {
        public VideoEntry Build(Video video)
        {
            return new VideoEntry
                {
                    Title = video.Title,
                    Description = video.Description,
                    Id = video.VideoId,
                    Duration = int.Parse(video.Media.Duration.Seconds)
                };  
        }
    }
}