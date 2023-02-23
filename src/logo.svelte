<script lang="ts" class:Logo>
    import * as T from '@threlte/core';
    import * as Three from 'three';

    const texture = new Three.TextureLoader().load(`src/assets/bird_free_city_logo.png`);
    export let position : { x: number; y: number; z: number } = {
		x: 0,
		y: 0,
		z: 0
	};
    let material = getMeshStandardMaterial(texture);

    function getMeshStandardMaterial(animation: Three.Texture) {
		animation.magFilter = Three.NearestFilter;
		return new Three.MeshStandardMaterial({
			map: animation,
			side: Three.DoubleSide,
			transparent: true,
            shadowSide: Three.DoubleSide,
            opacity: 1,
		});
	}
</script>

<T.Mesh 
    geometry={new Three.PlaneGeometry(35, 45)}
    {material}
    {position}
/>