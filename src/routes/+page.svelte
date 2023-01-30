<script lang="ts">
    import * as Threlte from '@threlte/core'
    import * as Three from 'three'
    import { onMount, tick } from 'svelte';
	import Bird from '../bird.svelte';
	import { BirdAnimation } from '../bird.types';

    let bird0: Bird;
    let bird1: Bird;
    let bird2: Bird;
    let bird3: Bird;
    let bird4: Bird;
    let bird5: Bird;
    let bird6: Bird;
    let bird7: Bird;
    let bird8: Bird;
    let birds: Array<Bird>;
    let position: {x: number, y: number, z: number};
    const sleep = async (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));
    onMount(async () => {
        await tick();
        birds = new Array(bird0, bird1, bird2, bird3, bird4, bird5, bird6, bird7, bird8); 
        for(let bird of birds) {
            bird.playIdleAnimation(1);
            bird.doBirdThings();
            await sleep(1000);
        };
    });

    function moveToRandomPos(bird: Bird) {
        console.log(`Got click event!`);
        let isNegative = Math.random() > .5;
        let movementRange = Math.floor(Math.random() * (60 - 30)) + 30;
        bird.takeOffToPos(isNegative ? -movementRange : movementRange);
    }
</script>

<Threlte.Canvas>
    <Threlte.PerspectiveCamera 
        position={{ x: 0, y: 0, z: 20}}
        fov={100}>
        <Threlte.OrbitControls/>
    </Threlte.PerspectiveCamera>    

    <Threlte.AmbientLight 
        color="white" 
        intensity={0.2} 
    />

    <Threlte.DirectionalLight 
        color="white"
        intensity={2}
        position={{ x: 10, y: 20}}
        shadow={{ camera: { top: 8 } }}
    />

    <Bird 
    bind:this={bird0}
    {position}
    />

    <Bird 
    bind:this={bird1}
    {position}
    />

    <Bird 
    bind:this={bird2}
    {position}
    />

    <Bird 
    bind:this={bird3}
    {position}
    />

    <Bird 
    bind:this={bird4}
    {position}
    />

    <Bird 
    bind:this={bird5}
    {position}
    />

    <Bird 
    bind:this={bird6}
    {position}
    />

    <Bird 
    bind:this={bird7}
    {position}
    />

    <Bird 
    bind:this={bird8}
    {position}
    />

    <Threlte.Mesh 
        geometry={new Three.PlaneGeometry(150, 30)}
        material={
            new Three.MeshStandardMaterial({
                color:'white', 
                side:Three.DoubleSide
            })
        }
        receiveShadow
    />
</Threlte.Canvas>
