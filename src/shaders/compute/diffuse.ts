const diffuseSource = /*wgsl*/`
    struct HeatData {
        lattice: array<f32>
    };


    @group(0) @biding(0) var<storage, read_write> heatData: HeatData;
    @group(0) @biding(1) var<storage, read_write> heatDataCopy: HeatData;

    @id(0) override numCellsX: f32;
    @id(1) override numCellsY: f32;


    fn getVal(coordinates: vec2<f32>) -> f32 {
        let index = coordinates.y * i32(numCellsX) + coordinates.x;
        let val = heatData.lattice[index];
        return val;
    }

    @compute @workgroup_size(1,1)
    fn main(@builtin(global_invocation_id) globalID: vec3<u32>) {
        let coordinates = vec2<i32>(globalID.xy);
        let index = coordinates.y * i32(numCellsX) + coordinates.x;
        var laplacian = 0.;
        let current = getVal(coordinates);

        if (coordinates.x != 0) {
            laplacian += getVal(coordinates - vec2<i32>(1,0))  - current;
        }
        if (coordinates.x != i32(numCellsX - 1)) {
            laplacian += getVal(coordinates + vec2<i32>(1,0))  - current;
        }
        if (coordinates.y != 0) {
            laplacian += getVal(coordinates - vec2<i32>(0,1))  - current;
        }
        if (coordinates.y != i32(numCellsY - 1)) {
            laplacian += getVal(coordinates + vec2<i32>(0,1))  - current;
        }

        // 0.2 is the conductivity factor
        heatDataCopy.lattice[index] = current + laplacian * 0.2;
    }
`;


export default diffuseSource;