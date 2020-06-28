package game.entities.player;

import game.GameGraphics;
import game.Sprite;
import game.entities.SpriteComponent;
import game.gl.Texture;

public class PlayerSprite extends SpriteComponent {

    // Image size, in pixels
    private static final int WIDTH_PX = 16;
    private static final int HEIGHT_PX = 16;

    private Texture tex;

    public PlayerSprite(GameGraphics gfx, Texture tex) {
        super(gfx);

        this.tex = tex;
    }

    @Override
    protected Sprite createSprite() {
        return Sprite.pixelScale(tex, 0, 0, WIDTH_PX, HEIGHT_PX);
    }

}
