<div class="scene">
    <slot />
</div>

<style>
    .scene {
        width: 100%;
        height: 100%;
        position: absolute;
        inset: 0;
        background: radial-gradient(hsl(220, 14%, 20%), hsl(0, 0%, 0%));
        background-attachment: fixed;
    }
</style>