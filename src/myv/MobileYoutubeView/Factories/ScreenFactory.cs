using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MobileYoutubeView.Models;

namespace MobileYoutubeView.Factories
{
    public class ScreenFactory
    {
        public Screen CreateNew(string connectionId, string name)
        {
            var screen = new Screen()
                {
                    Id = Guid.NewGuid(),
                    Started = DateTime.Now,
                    Name = name
                };

            screen.Connected.Add(connectionId);

            return screen;
        }
    }
}