using System.Xml.Serialization;

namespace MobileYoutubeView.Models
{
    [XmlType(AnonymousType = true)]
    [XmlRoot(ElementName = "toplevel", IsNullable = false)]
    public class YouTubeSuggestionList
    {
        [XmlElement("CompleteSuggestion")]
        public CompleteSuggestion[] CompleteSuggestion { get; set; }
    }

    [XmlType(AnonymousType = true)]
    public class CompleteSuggestion
    {
        [XmlElement("suggestion")]
        public Suggestion Suggestion { get; set; }
    }

    [XmlType(AnonymousType = true)]
    public class Suggestion
    {
        [XmlAttribute("data")]
        public string Data { get; set; }
    }
}