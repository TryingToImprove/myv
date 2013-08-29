using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace MobileYoutubeView.Models
{

    /// <remarks/>
    [System.Xml.Serialization.XmlTypeAttribute(AnonymousType = true)]
    [System.Xml.Serialization.XmlRootAttribute(Namespace = "", IsNullable = false)]
    public partial class toplevel
    {

        private toplevelCompleteSuggestion[] completeSuggestionField;

        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute("CompleteSuggestion")]
        public toplevelCompleteSuggestion[] CompleteSuggestion
        {
            get
            {
                return this.completeSuggestionField;
            }
            set
            {
                this.completeSuggestionField = value;
            }
        }
    }

    /// <remarks/>
    [System.Xml.Serialization.XmlTypeAttribute(AnonymousType = true)]
    public partial class toplevelCompleteSuggestion
    {

        private toplevelCompleteSuggestionSuggestion suggestionField;

        /// <remarks/>
        public toplevelCompleteSuggestionSuggestion suggestion
        {
            get
            {
                return this.suggestionField;
            }
            set
            {
                this.suggestionField = value;
            }
        }
    }

    /// <remarks/>
    [System.Xml.Serialization.XmlTypeAttribute(AnonymousType = true)]
    public partial class toplevelCompleteSuggestionSuggestion
    {

        private string dataField;

        /// <remarks/>
        [System.Xml.Serialization.XmlAttributeAttribute()]
        public string data
        {
            get
            {
                return this.dataField;
            }
            set
            {
                this.dataField = value;
            }
        }
    }


}