using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(AngularJsWithMvc.Startup))]
namespace AngularJsWithMvc
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
