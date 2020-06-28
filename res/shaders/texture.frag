#version 330 core

uniform sampler2D tex;

in Data {
    vec2 tex_coord;
} DataIn;

out vec4 frag_colour;

void main(void) {
    vec4 tex_colour = texture(tex, DataIn.tex_coord);
    frag_colour = tex_colour;
}
