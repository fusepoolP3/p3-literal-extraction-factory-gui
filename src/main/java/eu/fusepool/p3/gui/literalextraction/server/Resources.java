package eu.fusepool.p3.gui.literalextraction.server;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

@Path("resources")
public class Resources {

    public Resources() {
    }

    @GET
    @Path("/test")
    @Produces("text/plain")
    public String test() {
        return "Hello world!";
    }
}
