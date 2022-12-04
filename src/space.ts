import { join } from "path";
import vertexSource from "./shaders/render/vertex";
import fragmentSource from "./shaders/render/fragment";
import diffuseSource from "./shaders/compute/diffuse";


export type MouseState = {
  pressed: 'left' | 'right' | 'none';
  x: number;
  y: number;
  r: number;
};

class Space {
  mouseState: MouseState = { pressed: 'none', x: 0, y: 0, r: 20 };
  device: GPUDevice;
  numCellsX: number;
  numCellsY: number;
  bindGroup: GPUBindGroup;

  constructor(device: GPUDevice, numCellsX: number, numCellsY: number) {
    this.device = device;
    this.numCellsX = numCellsX;
    this.numCellsY = numCellsY;

    const vertices = [-1, -1,
                       1, -1,
                       1, 1,

                       -1, -1,
                       -1, 1,
                        1, 1];
    const verticesBuffer = device.createBuffer({
      size : 48,
      usage : GPUBufferUsage.VERTEX,
      mappedAtCreation : true
    });

    const verticeArrayBuffer = verticesBuffer.getMappedRange();
    new Float32Array(verticeArrayBuffer).set(vertices);
    verticesBuffer.unmap();
    

    const heatBuffer = device.createBuffer({
      size : numCellsX * numCellsY * 4,
      usage : GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      mappedAtCreation : true
    })

    const heatData = new Array(numCellsX * numCellsY).fill(0).map(
      (_, i) => i < numCellsX * numCellsY/2 ?1 : 0)

    const heatArrayBuffer = heatBuffer.getMappedRange();
    new Float32Array(heatArrayBuffer).set(heatData);
    heatBuffer.unmap();
    
    const heatCopyBuffer = device.createBuffer({
      size : numCellsX * numCellsY * 4,
      usage : GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    })
    

    const bindGroupLayoutEntries: GPUBindGroupLayoutEntry[] = [{
      binding : 0,
      visibility : GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT,
      buffer : {type : "storage"}
    },
    {
      binding : 1,
      visibility : GPUShaderStage.COMPUTE,
      buffer : {type : "storage"}
    }];

    const bindGroupLayout = device.createBindGroupLayout({entries: bindGroupLayoutEntries});
    const bindGroupEntries : GPUBindGroupEntry[] = [
      {binding: 0,
       resource: {buffer : heatBuffer}
      },
      {binding: 1,
        resource: {buffer : heatCopyBuffer}
      }
    ];
    
    this.bindGroup = device.createBindGroup({
      layout: bindGroupLayout,
      entries: bindGroupEntries
    })

    const vertexModule = device.createShaderModule({
      code: vertexSource
    });

    const fragmentModule = device.createShaderModule({
      code: fragmentSource
    });

    const diffuseModule = device.createShaderModule({
      code: diffuseSource
    });

  }


  step() {}

  render() {}

  setMouseState(mouseState: MouseState) {
    this.mouseState = mouseState;
  }
}

export default Space;
