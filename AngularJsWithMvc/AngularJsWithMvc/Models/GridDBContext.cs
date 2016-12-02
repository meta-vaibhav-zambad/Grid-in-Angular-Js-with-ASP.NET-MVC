using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace AngularJsWithMvc.Models {

    public class GridDBContext : DbContext {

        public DbSet<Grid> Grids { get; set; }
        public DbSet<Person> Persons { get; set; }
    }
}