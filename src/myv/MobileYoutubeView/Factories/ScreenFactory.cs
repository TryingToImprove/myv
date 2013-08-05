using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MobileYoutubeView.Models;

namespace MobileYoutubeView.Factories
{
    public class ScreenFactory
    {
        public Screen CreateNew(string name)
        {
            var screen = new Screen()
                {
                    Id = Guid.NewGuid(),
                    Started = DateTime.Now
                };

            return screen;
        }
    }
}