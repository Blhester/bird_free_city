<script lang="ts">
	import * as Threlte from '@threlte/core';
	import * as Three from 'three';
	import { onMount, tick, onDestroy, beforeUpdate } from 'svelte';
    import { fly, fade } from 'svelte/transition';
    import { tweened, type Tweened } from 'svelte/motion';
	import Bird from '../bird.svelte';
    import viewport from '../useViewportAction';
	import Logo from '../logo.svelte';
    import { sineInOut } from 'svelte/easing';
    import Saos from "saos";

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
    let innerWidth: number;
    let innerHeight: number;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let outerHeight = 0;
    let buttonPosY = 0;
    let buttonPosX = 0;
    $: scrollY = 0;
    let showAboutUs = true;
    $: canvasTopMargin = 0;
    $: showDropDownMenu = false;

    type PageValues = {
        [key: string] : boolean;
    }

    let pageValues : PageValues = {
        showDefaultIntro: true,
        showAboutUs: false,
        showOurWork: false,
        showContactUs: false,
        showRequestAQuote: false,
    }

    const cloudMotion1 = tweened(0, {
        duration: 4000,
        easing: sineInOut
    });

	const sleep = async (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));


    function onResize() {
        innerWidth = window.innerWidth;
        innerHeight = window.innerHeight;
        outerHeight = window.outerHeight;
        canvasWidth = innerWidth;
        canvasHeight = innerHeight * .50;
        buttonPosY = 10;
        console.log(`The client innerWidth is ${innerWidth} and innerHeight is ${innerHeight}`);
	}


    // Disable Scrolling
    // window.addEventListener('wheel', preventScroll, {passive:false});
    // function preventScroll(e: WheelEvent) {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     return false;
    // }

    async function doFunctionNTimesOnTimeout(fn: Function, n: number, msTimeout: number) {
        for (let i = 0; i < n; i++) {
            await fn();
            await sleep(msTimeout);
        }
    }

    async function startClouds() {
        setInterval(async ()=> {
            cloudMotion1.set(10);
            await sleep(4000);
            cloudMotion1.set(-10);
        }, 8000);
    }

	onMount(async () => {
        await tick();
        startClouds();
        onResize();
 		window.addEventListener('resize', onResize);

		birds = [bird0, bird1, bird2, bird3, bird4, bird5, bird6, bird7, bird8];
		for (let bird of birds) {
			bird.doBirdThings();
			await sleep(1000);
		}
	});

    onDestroy(() => {
        return () => window.removeEventListener('resize', onResize);
    });

    function togglePageView(key: keyof PageValues): void {
        for (const valueKey in pageValues) {
            if (valueKey === key) {
                pageValues[valueKey] = true;
            } else {
                pageValues[valueKey] = false;
            }
        }
    }
</script>

<svelte:window bind:innerWidth bind:innerHeight bind:outerHeight/>

<div class="canvas" style="top: 3%;">
<Threlte.Canvas size={{height: 250, width: canvasWidth}}>
    
    <Logo position={{ x: 0, y: 16, z: -1}}/>
    <Threlte.PerspectiveCamera 
        position={{ x: 0, y: 13, z: 5 }}
        fov={145}
        >
    </Threlte.PerspectiveCamera>

    <Threlte.AmbientLight color="white" intensity={0.3} />

    <Threlte.DirectionalLight
        color="white"
        intensity={1}
        position={{ x: 0, y: 20, z: -20 }}
    />

    <Bird bind:this={bird0}  />

    <Bird bind:this={bird1}  />

    <Bird bind:this={bird2}  />

    <Bird bind:this={bird3}  />

    <Bird bind:this={bird4}  />

    <Bird bind:this={bird5}  />

    <Bird bind:this={bird6}  />

    <Bird bind:this={bird7}  />

    <Bird bind:this={bird8}  />

</Threlte.Canvas>
</div>

<div class="page-menu" on:mouseenter={() => {showDropDownMenu = true}} on:mouseleave={() => {showDropDownMenu = false}}>
    <button class="open-menu-button" on:click={() => {showDropDownMenu = !showDropDownMenu}}>
        <svg viewBox="0 0 15 1" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y=".025" width="5" height=".25" fill="rgb(44, 105, 176)"/>
            <rect x="5" y=".425" width="5" height=".25" fill="rgb(44, 105, 176)"/>
            <rect x="5" y=".825" width="5" height=".25" fill="rgb(44, 105, 176)"/>
        </svg>                           
    </button>
    <div class="dropdown-menu show">
        <button class="{showDropDownMenu ? 'pop in' : 'pop out'}" on:click={() => {togglePageView('showAboutUs')}}>
        About Us
        </button>
        <button class="{showDropDownMenu ? 'pop in' : 'pop out'}" on:click={() => {togglePageView('showContactUs')}}>
        Contact Us
        </button>
        <button class="{showDropDownMenu ? 'pop in' : 'pop out'}" on:click={() => {togglePageView('showOurWork')}}>
        See Our Work
        </button>
        <button class="{showDropDownMenu ? 'pop in' : 'pop out'}" on:click={() => {togglePageView('showRequestAQuote')}}>
            Request A Quote
        </button>
    </div>
</div>



<div class="page-content" style="top: {innerHeight * .35}px;">
    {#if pageValues['showDefaultIntro']}
    <div class="intro-container">
        <h3 class="intro-title">Got bird Problem's?</h3>
        <svg class="up-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <defs>
              <filter id="shadow">
                <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.75)"/>
              </filter>
            </defs>
            <path fill="rgb(32, 77, 164)" filter="url(#shadow)" d="M12 2L2 12h5v10h10V12h5L12 2z"/>
          </svg>   
        <p class="intro-text">Click our options to see how we can help you today.</p>
    </div>
    {/if}


    {#if pageValues['showAboutUs']}
    <Saos animation={'from-left 2s cubic-bezier(0.35, 0.5, 0.65, 0.95) both'} bottom={100}>
        <div class="sliding-container">
            <h3 class="container-title"> About Us 1</h3>
            <p class="container-text"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
                ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in 
                voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat 
                non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
            </p>
        </div>
    </Saos>
    {/if}

    {#if pageValues['showContactUs']}
    <Saos animation={'from-left 2s cubic-bezier(0.35, 0.5, 0.65, 0.95) both'} top={100} bottom={100}>
        <div class="sliding-container">
            <h3 class="container-title"> Contact Us </h3>
            <p class="container-text"> 
                Call or email to see how we can help you regain you or your clients property!

                There are so many ways we can assist you with your bird problem. Contact us now to find out how we can be of service to you!
                Bird Free City Inc.
                
                PO Box 3023 Leesburg, Virginia 20177, United States
                
                703.777.7562 info@birdfreecity.com
                Hours
                
                Monday - Friday: 8am - 6pm
                
                Saturday - Sunday: Closed 
            </p>
        </div>
    </Saos>
    {/if}

    {#if pageValues['showOurWork']}
    <div class="fb-page-content">
        <Saos animation={'from-left 2s cubic-bezier(0.35, 0.5, 0.65, 0.95) both'} top={100} bottom={100}>    
            <div class="sliding-container"> Slide-show goes here </div>
        </Saos>
    </div>
    {/if}

    {#if pageValues['showRequestAQuote']}
    <div class="request-a-quote">
        <Saos animation={'from-left 2s cubic-bezier(0.35, 0.5, 0.65, 0.95) both'} top={100} bottom={100}>    
            <div class="sliding-container"> 
                <form>
                    <div>
                      <label for="name">Name:</label>
                      <input type="text" name="name" id="name" required>
                    </div>
                    <div>
                      <label for="email">Email:</label>
                      <input type="email" name="email" id="email" required>
                    </div>
                    <div>
                      <label for="phone">Phone:</label>
                      <input type="tel" name="phone" id="phone" required>
                    </div>
                    <div>
                      <label for="message">Message:</label>
                      <textarea name="message" id="message" required></textarea>
                    </div>
                    <div>
                      <button type="submit" class="pop quote-submit">Submit</button>
                    </div>
                  </form>
            </div>
        </Saos>
    </div>
    {/if}
</div>

<button class="payment">
    Pay Now
</button>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Lato:wght@700&display=swap');

    @keyframes -global-from-left {
        0% {
            transform: rotateX(50deg) translateX(-200vw) skewX(-50deg);
            opacity: 0;
        }
        100% {
            transform: rotateX(0deg) translateX(0) skewX(0deg);
            opacity: 1;
        }
    }

    @keyframes -reveal-text {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    p,button,h3,div,input,textarea,label {
        font-family: 'Lato', sans-serif;
    }
    button {
        background-color: transparent;
        border: none;
    }

    .intro-container {
        width: 100%;
        color: rgb(32, 77, 164);
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 1);
    }

    .up-arrow {
        width: 50px;
        margin-left: 4%;
        animation: -reveal-text 4s ease-in-out 4s;
        animation-fill-mode: forwards;
        opacity: 0;
    }

    .intro-title {
        font-size: 4em;
        text-align: center;
        margin-bottom: 100px;
        animation: -reveal-text 4s ease-in-out;
        animation-fill-mode: forwards;
        opacity: 0;
    }

    .intro-text {
        font-size: 1.5em;
        text-align: left;
        margin-left: 10px;
        animation: -reveal-text 4s ease-in-out 4s;
        animation-fill-mode: forwards;
        opacity: 0;
    }

    .sliding-container h3 {
        font-size: 3em;
        margin-bottom: -30px;
        width: 100%;
        text-align: left;
    }

    .sliding-container p {
        font-size: 1.25em;
    }
    

    .page-menu {
        position: fixed;
        top: 30%;
        z-index: 20;
        min-width: 200px;
    }

    .page-content {
        display: block;
        position: fixed;
        align-items: center;
        transform: translateY(-10%);
        min-width: 100%;
        left: 0;
    }

    .sliding-container {
        position: relative;
        text-align: left;
        text-decoration: none;
        color: white;
        margin: 10px auto 200px auto;
        max-height: 40%;
        max-width: 90%;
        background: linear-gradient(93deg, rgba(32, 77, 164, .9) 0%, rgba(64, 128, 194, .9) 100%);
        border-radius: 25px;
        box-shadow: 0 5px 20px black;
    }

    @media screen and (max-width: 768px) {
        .page-menu {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            /* other styles */
        }
    }

    .open-menu-button {
        width: 100%;
        background-color: rgb(64, 128, 194);
        color: #fff;
        border: none;
        padding: 5px 20px;
        border-radius: 5px;
        font-size: 16px;
        font-weight: 600;
        text-align: center;
        text-decoration: none;
        cursor: pointer;
        box-shadow: 0 5px 10px rgba(0, 0, 0, .3);
    }

    .open-menu-button:hover {
        background-color: rgb(124, 170, 224);
    }
    .open-menu-button:click {
        background-color: rgb(124, 170, 224);
    }

    .dropdown-menu {
        width: 100%;
        position: absolute;
        display: none;
    }

    .show {
        display: block;
    }

    @keyframes pop-in-animation {
        0% {
            opacity: 0;
            transform: scale(0.5);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes pop-out-animation {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0.5);
        }
    }

    .request-a-quote label {
        margin-right: 10px;
        text-align: center;
    }

    .request-a-quote input,textarea {
        background-color: white;
        border-radius: 4px;
        padding: 10px;
        margin-top: 5px;
        color: rgb(64, 128, 194);
        border: none;
        text-align: center;
        border: 1px solid #e2e8f0;
        border-radius: 0.25rem;
        max-width: 200px;
        min-width: 150px;
    }

    .pop {
        display: block;
        width: 100%;
        background-color: rgb(64, 128, 194);
        color: #fff;
        padding-top: 10px;
        padding-bottom: 10px;
        border-radius: 5px;
        font-size: 16px;
        font-weight: 600;
        text-align: center;
        text-decoration: none;
        border-top: 1px solid rgb(32, 77, 164);
        cursor: pointer;
    }

    .pop.quote-submit {
        max-width: 40%;
        margin-left: auto;
        margin-right: auto;
    }

    .pop:hover {
        background-color: rgb(124, 170, 224);
    }

    .pop.in {
        opacity: 0;
        transform: scale(0.5);
        animation: pop-in-animation 0.5s ease forwards;
    }

    .pop.out {
        opacity: 1;
        transform: scale(1);
        animation: pop-out-animation 0.5s ease forwards;
    }

    .canvas {
        position: fixed;
    }

    .container-text {
        width: 90%;
        height: 90%;
        margin: auto;
        color: white;
        padding: 20px 30px 20px 30px;
    }

    .container-title {
        margin: auto;
        max-width: 20%;
        color: white;
        padding: 20px 30px 20px 30px;
        font-size: 30px;
    }

    .payment { 
        position: fixed;
        background-color: #4CAF50;
        color: white;
        border-radius: 10px;
        border: none;
        padding: 15px;
        box-shadow: 0 7px rgb(9, 9, 9, 0.2);
        cursor: pointer;
        text-align: center;
        text-decoration: none;
        font-size: 20px;
        right: 10%;
        bottom: 10%;
    }

    .payment:hover {
        background-color: #3e8e41
    }

    .payment:active {
        background-color: #3e8e41;
        box-shadow: 0 4px rgb(9, 9, 9, 0.4);
        transform: translateY(2px);
    }
    
    .fb-page-content {
        overflow-y: hidden;
        overflow-x: hidden;
        margin-left: auto;
        margin-right: auto;
    }
</style>
