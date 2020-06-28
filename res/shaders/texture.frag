#version 330 core

uniform sampler2D tex;

uniform bool use_override_colour;
uniform vec3 override_colour;

in Data {
    vec4 colour;
    vec2 tex_coord;
} DataIn;

out vec4 frag_colour;

void main(void) {
    vec4 tex_colour = texture(tex, DataIn.tex_coord);
    if (use_override_colour) {
        frag_colour = vec4(override_colour.r, override_colour.g, override_colour.b, tex_colour.a);
    } else {
        frag_colour = DataIn.colour * tex_colour;
    }
}
