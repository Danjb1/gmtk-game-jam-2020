#version 330 core

uniform mat4 view_proj_matrix;

layout(location = 0) in vec2 in_vertex;
layout(location = 1) in vec2 in_tex_coord;
layout(location = 2) in vec4 in_colour;

out Data {
    vec4 colour;
    vec2 tex_coord;
} DataOut;

void main(void) {
    gl_Position = view_proj_matrix * vec4(in_vertex, 0, 1);
    
    DataOut.colour = in_colour;
    DataOut.tex_coord = in_tex_coord;
}
