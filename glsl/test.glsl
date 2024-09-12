uniform sampler2D colorTexture;
uniform sampler2D depthTexture;
in vec2 v_textureCoordinates;
out vec4 fragColor;
void main(void) {
    float depth = czm_readDepth(depthTexture, v_textureCoordinates);
    vec4 color = texture(colorTexture, v_textureCoordinates);
    if(depth < 1.0 - 0.000001) {
        fragColor = color;
    } else {
        fragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
}