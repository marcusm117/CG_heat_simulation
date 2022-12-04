const fragmentSource =  /*wgsl*/`
    struct HeatData {
        lattice: array<f32>
    };

    @group(0) @biding(0) var<storage, read_write> heatData: HeatData;

    @id(0) override numCellsX: f32;
    @id(1) override numCellsY: f32;


    fn getVal(coordinates: vec2<f32>) -> f32 {
        let index = coordinates.y * i32(numCellsX) + coordinates.x;
        let val = heatData.lattice[index];
        return val;
    }

    @fragment
    fn main(@location(0) normalized: vec2<f32>) -> @location(0) vec4<f32> {
        let numCells = vec2<f32>(numCellsX, numCellsY);
        let coordinates = vec2<f32>(normalized * numCells);
        let val = getVal(coordinates);
        let color = vec3<f32>(val);

        return vec4<f32>(color, 1);
    }
`;


export default fragmentSource;