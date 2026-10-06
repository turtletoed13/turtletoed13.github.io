# Arashi model assets

NOLINE automatically discovers runtime model files under this directory.

Put the model anywhere under the Arashi vehicle directory except the source folder. The filename does not matter.

Recommended production asset: GLB / glTF 2.0 with PBR materials.

Runtime loaders: GLB, GLTF, FBX, OBJ + MTL, DAE, 3DS, 3MF, AMF, VRML/WRL, USDZ, PLY, STL, XYZ, PCD, VOX.

Original/source project files can be preserved under source/ and are not sent to the browser runtime.

Source formats: BLEND, MAX, C4D, MA, MB, USD, USDA, USDC.

NOLINE selects the highest-priority runtime asset automatically, with GLB/glTF preferred.