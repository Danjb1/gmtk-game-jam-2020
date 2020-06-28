package game.io;

import java.io.IOException;
import java.io.InputStream;

public class Resources {

    public static final String SHADER_DIR = "res/shaders/";

    public static InputStream getResourceAsStream(String filename)
            throws IOException {
        
        InputStream in =
                Resources.class.getClassLoader().getResourceAsStream(filename);
        if (in == null) {
            throw new IOException("Unable to open: " + filename);
        }

        return in;
    }

}
