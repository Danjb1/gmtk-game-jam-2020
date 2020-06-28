package game;

import static org.lwjgl.opengl.GL11.glViewport;

import java.nio.FloatBuffer;
import java.util.ArrayList;
import java.util.List;

import org.joml.Matrix4f;
import org.lwjgl.BufferUtils;

import engine.GraphicsContext;
import game.gl.SpriteArrayDrawable;
import game.gl.Texture;
import game.gl.TextureRenderer;
import game.shaders.ShaderProgram;
import game.shaders.TextureShader;

public class GameGraphics implements GraphicsContext {

    /**
     * The maximum number of Sprites we can draw in one frame.
     */
    private static final int MAX_SPRITES = 1000;

    private Camera camera;
    private Rectangle viewport;
    private List<Sprite> sprites = new ArrayList<>();

    private static FloatBuffer fb16 = BufferUtils.createFloatBuffer(16);
    private static Matrix4f viewProjMatrix = new Matrix4f();
    private SpriteArrayDrawable spritesDrawable =
            new SpriteArrayDrawable(MAX_SPRITES);

    public GameGraphics(Rectangle viewport, Camera camera) {
        this.viewport = viewport;
        this.camera = camera;
    }

    @Override
    public void destroy() {
        if (spritesDrawable != null && spritesDrawable.isInitialised()) {
            spritesDrawable.destroy();
        }
    }

    @Override
    public int getWidth() {
        return (int) viewport.width;
    }

    @Override
    public int getHeight() {
        return (int) viewport.height;
    }

    @Override
    public void render() {

        if (!spritesDrawable.isInitialised()) {
            spritesDrawable.initialise();
        }

        // Use our camera and viewport
        projectToWorld();

        // Send our Sprite data to the GPU
        spritesDrawable.update(sprites);

        // Render our Sprites.
        // For now, we just use the Texture of the first Sprite.
        // TODO: We should sort Sprites by Texture.
        if (!sprites.isEmpty()) {
            Texture spriteTexture = sprites.get(0).texture;
            TextureRenderer.render(
                    spriteTexture,
                    spritesDrawable.getVao(),
                    spritesDrawable.getNumVertices());
        }
    }

    /**
     * Sets up the shader to draw to the game world.
     */
    public void projectToWorld() {

        // Set the region of the window we are going to draw to
        glViewport((int) viewport.x,
                (int) viewport.y,
                (int) viewport.width,
                (int) viewport.height);

        // Get camera position
        float cameraX = camera.visibleRect.getCenterX();
        float cameraY = camera.visibleRect.getCenterY();

        // Set view and projection
        viewProjMatrix
                .setOrtho2D(
                        -camera.visibleRect.width / 2,
                        camera.visibleRect.width / 2,
                        camera.visibleRect.height / 2,
                        -camera.visibleRect.height / 2
                ).lookAt(
                        cameraX, cameraY, Camera.Z_DISTANCE,  // Camera position
                        cameraX, cameraY, 0,                  // "Look" vector
                        0, 1, 0                               // "Up" vector
                );

        // Pass this matrix to our shader
        ShaderProgram shader = TextureShader.get();
        shader.use();
        shader.setUniformMatrix4f(
                TextureShader.UNIFORM_VIEW_PROJ_MATRIX,
                viewProjMatrix.get(fb16));
    }

    public void addSprite(Sprite sprite) {
        sprites.add(sprite);
    }

    public void removeSprite(Sprite sprite) {
        sprites.remove(sprite);
    }

}
