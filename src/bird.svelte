<script lang="ts" class:Bird>
	import * as T from '@threlte/core';
	import * as Three from 'three';
	import { BirdAnimation } from './bird.types';

	export let spawnRange: { xMin: number; xMax: number } = { xMin: -75, xMax: 75 };
	export let movementRange: { xMin: number; xMax: number } = { xMin: -75, xMax: 75 };
	export let position: { x: number; y: number; z: number } = {
		x: randomMinMax(spawnRange.xMin, spawnRange.xMax),
		y: 0,
		z: Math.floor(Math.random() * 1) + .25
	};

    function calculateTravelDistance(
        currentPos: number, 
        destination: number) {
            if (destination > currentPos) {
                return destination - currentPos;
            } else {
                return -1 * (currentPos - destination);
            }
    }

	export function takeOffToPos(destinationX: number) {
		let originalPos: { x: number; y: number } = { x: position.x, y: position.y };
		let currentInterval: ReturnType<typeof setInterval>;
		let travelDistance = calculateTravelDistance(originalPos.x, destinationX);
		let traveled = 0;
		let travelInNegativeDirection = travelDistance < 0;
		rotation = travelInNegativeDirection ? { x: 0, y: Math.PI, z: 0 } : { x: 0, y: 0, z: 0 };
        travelDistance = Math.abs(travelDistance);
        if (travelDistance < 10) travelDistance = 10;
		let intervalId = setInterval(() => {
			if (traveled === travelDistance) {
				clearInterval(currentInterval);
				playIdleAnimation(1);
				clearInterval(intervalId);
			}

			if (traveled === .25) {
				currentInterval = playAnimations(BirdAnimation.TAKE_OFF, 75);
			} else if (traveled === 2.5) {
				clearInterval(currentInterval);
				currentInterval = playAnimations(BirdAnimation.TAKE_OFF_2, 75);
			} else if (traveled === 5) {
				clearInterval(currentInterval);
				currentInterval = playAnimations(BirdAnimation.FLY, 35);
			} else if (traveled === Math.floor(travelDistance * .9)) {
				clearInterval(currentInterval);
				currentInterval = playAnimations(BirdAnimation.TAKE_OFF_2, 75);
			}

			travelInNegativeDirection ? (position.x -= 0.25) : (position.x += 0.25);
			traveled += 0.25;
			let newYPos = travelInNegativeDirection
				? -(
						(position.x - originalPos.x) * (position.x - originalPos.x) +
						travelDistance * (position.x - originalPos.x)
				  ) /
				  (travelDistance * 1.5)
				: -(
						(position.x - originalPos.x) * (position.x - originalPos.x) -
						travelDistance * (position.x - originalPos.x)
				  ) /
				  (travelDistance * 1.5);
			position.y = newYPos < 0 ? 0 : newYPos;
		}, 15);
	}

	export function playAnimations(
		animation: BirdAnimation,
		frameInterval: number
	): ReturnType<typeof setInterval> {
		let currentIndex = 0;
		let animationSequence = getAnimationSequence(animation);
		if (animationSequence.length === 0) {
			new Error('Invalid animation sequence');
		}

		return setInterval(() => {
			if (currentIndex === animationSequence.length) {
				currentIndex = 0;
			}

			material = getCurrentSprite(currentIndex, animationSequence);
			currentIndex++;
		}, frameInterval);
	}

	const animationTypes = {
		PECK: [
			new Three.TextureLoader().load(`src/assets/bird_sprites_maybe-${0}.png`),
			new Three.TextureLoader().load(`src/assets/bird_sprites_maybe-${1}.png`),
			new Three.TextureLoader().load(`src/assets/bird_sprites_maybe-${2}.png`),
			new Three.TextureLoader().load(`src/assets/bird_sprites_maybe-${3}.png`)
		],
		TAKE_OFF: [
			new Three.TextureLoader().load(`src/assets/bird_sprites_maybe-${4}.png`),
			new Three.TextureLoader().load(`src/assets/bird_sprites_maybe-${5}.png`),
			new Three.TextureLoader().load(`src/assets/bird_sprites_maybe-${6}.png`)
		],
		TAKE_OFF_2: [
			new Three.TextureLoader().load(`src/assets/bird_sprites_maybe-${7}.png`),
			new Three.TextureLoader().load(`src/assets/bird_sprites_maybe-${8}.png`),
			new Three.TextureLoader().load(`src/assets/bird_sprites_maybe-${9}.png`)
		],
		FLY: [
			new Three.TextureLoader().load(`src/assets/bird_sprites_maybe-${10}.png`),
			new Three.TextureLoader().load(`src/assets/bird_sprites_maybe-${11}.png`),
			new Three.TextureLoader().load(`src/assets/bird_sprites_maybe-${12}.png`),
			new Three.TextureLoader().load(`src/assets/bird_sprites_maybe-${13}.png`),
			new Three.TextureLoader().load(`src/assets/bird_sprites_maybe-${14}.png`),
			new Three.TextureLoader().load(`src/assets/bird_sprites_maybe-${15}.png`),
			new Three.TextureLoader().load(`src/assets/bird_sprites_maybe-${16}.png`),
			new Three.TextureLoader().load(`src/assets/bird_sprites_maybe-${17}.png`),
			new Three.TextureLoader().load(`src/assets/bird_sprites_maybe-${18}.png`),
			new Three.TextureLoader().load(`src/assets/bird_sprites_maybe-${19}.png`)
		]
	};

	let material: Three.MeshStandardMaterial = getCurrentSprite(3, animationTypes.PECK);
	let rotation: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };

	export async function playIdleAnimation(numberOfLoops: number) {
		for (let i = 0; i < numberOfLoops; i++) {
			material = getCurrentSprite(3, animationTypes.PECK);
			await sleep(150);
			let shouldFlip = Math.random() > 0.75;
			if (shouldFlip) flipRotation();
			await sleep(2000);
		}
	}

	function flipRotation() {
		rotation.y === 0 ? rotation.y = Math.PI : rotation.y = 0;
	}

	function getCurrentSprite(
		spriteIndex: number,
		animationArray: Three.Texture[]
	): Three.MeshStandardMaterial {
		let map = animationArray[spriteIndex];
		map.magFilter = Three.NearestFilter;
		return new Three.MeshStandardMaterial({
			map: map,
			side: Three.DoubleSide,
			transparent: true,
            shadowSide: Three.DoubleSide,
            clipShadows: false,
            opacity: 1,
		});
	}

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

	function getAnimationSequence(animationType: BirdAnimation): Three.Texture[] {
		switch (animationType) {
			case BirdAnimation.FLY: {
				return animationTypes.FLY;
			}
			case BirdAnimation.PECK: {
				return animationTypes.PECK;
			}
			case BirdAnimation.TAKE_OFF: {
				return animationTypes.TAKE_OFF;
			}
			case BirdAnimation.TAKE_OFF_2: {
				return animationTypes.TAKE_OFF_2;
			}
			default:
				return [];
		}
	}

	export function doBirdThings() {
		playIdleAnimation(1);
		setInterval(() => {
			if (position.y === 0) {
				let shouldFly = Math.random() > 0.75;
				if (shouldFly) {
					let isNegative = Math.random() > 0.5;
					let moveToPosition = Math.floor((Math.random() * (movementRange.xMax - 20)) + 20);
					let position = isNegative ? moveToPosition * -1 : moveToPosition;
					takeOffToPos(position);
				} else {
					playIdleAnimation(4);
				}
			}
		}, 10000);
	}

	async function playAnimationANumberOfTimes(
		animationType: BirdAnimation,
		endingFrame: number,
		frameInterval: number,
		numberOfLoops: number
	) {
		let animations = getAnimationSequence(animationType);
		for (let i = 0; i < numberOfLoops; i++) {
			for (let animation of animations) {
				material = getMeshStandardMaterial(animation);
				await sleep(frameInterval);
			}
		}
		material = getMeshStandardMaterial(animations[endingFrame]);
	}

	const sleep = async (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));
	function randomMinMax(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min)) + min;
	}
</script>

<T.Mesh
	geometry={new Three.PlaneGeometry(5, 5)}
	{material}
	{position}
	{rotation}
	castShadow
    receiveShadow
/>
