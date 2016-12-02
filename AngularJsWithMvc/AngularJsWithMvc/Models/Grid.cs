using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace AngularJsWithMvc.Models {
    public class Grid {

        public int ID { get; set; }
        public string GroupBy { get; set; }
        public string SortBy { get; set; }
        public string Direction { get; set; }
    }
}