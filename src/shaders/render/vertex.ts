const vertexSource =  /*wgsl*/`
    struct VSout {
        @builtin(position) position: vec2<i32>;
        @locaiton(0) normalized: vec2<i32>;
    };

    @vertex
    fn main(@locaiton(0) inPosition: vec2<f32>) -> VSout{
        var vsout: VSout;
        vsout.position = vec4<f32>(inPosition, 0, 1);
        vsout.normalized = inPosition * 0.5 + 0.5
        return vsout
    }
`;


export default vertexSource;